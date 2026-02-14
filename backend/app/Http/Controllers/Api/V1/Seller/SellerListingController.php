<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Seller;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Requests\UploadImagesRequest;
use App\Http\Resources\ListingImageResource;
use App\Http\Resources\ListingResource;
use App\Jobs\ProcessListingImages;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class SellerListingController extends Controller
{
    /**
     * List the seller's own listings with stats.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $listings = Listing::query()
            ->where('user_id', $request->user()->id)
            ->with(['images', 'category', 'brand', 'brandModel'])
            ->latest()
            ->paginate(24);

        return ListingResource::collection($listings);
    }

    /**
     * Create a new listing.
     */
    public function store(StoreListingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = ListingStatus::Draft->value;

        $listing = Listing::create($validated);
        $listing->load(['images', 'category', 'brand', 'brandModel']);

        return response()->json([
            'message' => 'Listing created as draft.',
            'data' => new ListingResource($listing),
        ], 201);
    }

    /**
     * Show a single listing (must be owner).
     */
    public function show(Request $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $listing->load([
            'images',
            'category',
            'brand',
            'brandModel',
            'specifications.specificationKey',
        ]);

        return response()->json([
            'data' => new ListingResource($listing),
        ]);
    }

    /**
     * Update a listing (must be owner).
     */
    public function update(UpdateListingRequest $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $listing->update($request->validated());
        $listing->load(['images', 'category', 'brand', 'brandModel']);

        return response()->json([
            'message' => 'Listing updated.',
            'data' => new ListingResource($listing),
        ]);
    }

    /**
     * Soft delete a listing (must be owner).
     */
    public function destroy(Request $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $listing->delete();

        return response()->json([
            'message' => 'Listing deleted.',
        ]);
    }

    /**
     * Publish a listing (change status to pending_review).
     */
    public function publish(Request $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if (! $listing->status->isEditable() && $listing->status !== ListingStatus::Draft) {
            return response()->json([
                'message' => 'This listing cannot be published in its current status.',
            ], 422);
        }

        $listing->update([
            'status' => ListingStatus::PendingReview,
        ]);

        return response()->json([
            'message' => 'Listing submitted for review.',
            'data' => new ListingResource($listing->load(['images', 'category', 'brand'])),
        ]);
    }

    /**
     * Upload images for a listing.
     */
    public function uploadImages(UploadImagesRequest $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $currentMaxPosition = $listing->images()->max('position') ?? -1;
        $uploadedImages = [];

        foreach ($request->file('images') as $index => $imageFile) {
            $path = $imageFile->store("listings/{$listing->id}", 'public');

            $image = $listing->images()->create([
                'original_url' => $path,
                'position' => $currentMaxPosition + $index + 1,
                'file_size' => $imageFile->getSize(),
                'alt_text' => $listing->title,
            ]);

            $uploadedImages[] = $image;
        }

        // Update image count
        $listing->update(['image_count' => $listing->images()->count()]);

        // Dispatch job to process images (resize, convert to webp, etc.)
        ProcessListingImages::dispatch($listing);

        return response()->json([
            'message' => count($uploadedImages) . ' image(s) uploaded. Processing in background.',
            'data' => ListingImageResource::collection(collect($uploadedImages)),
        ], 201);
    }

    /**
     * Delete a single image from a listing.
     */
    public function deleteImage(Request $request, Listing $listing, ListingImage $image): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($image->listing_id !== $listing->id) {
            return response()->json(['message' => 'Image does not belong to this listing.'], 404);
        }

        // Delete files from storage
        $paths = array_filter([
            $image->original_url,
            $image->large_url,
            $image->medium_url,
            $image->thumbnail_url,
            $image->webp_url,
        ]);

        foreach ($paths as $path) {
            Storage::disk('public')->delete($path);
        }

        $image->delete();

        // Update image count
        $listing->update(['image_count' => $listing->images()->count()]);

        return response()->json([
            'message' => 'Image deleted.',
        ]);
    }

    /**
     * Reorder images for a listing.
     */
    public function reorderImages(Request $request, Listing $listing): JsonResponse
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'image_ids' => ['required', 'array'],
            'image_ids.*' => ['integer', 'exists:listing_images,id'],
        ]);

        $imageIds = $request->input('image_ids');

        foreach ($imageIds as $position => $imageId) {
            ListingImage::where('id', $imageId)
                ->where('listing_id', $listing->id)
                ->update(['position' => $position]);
        }

        return response()->json([
            'message' => 'Images reordered.',
            'data' => ListingImageResource::collection(
                $listing->images()->orderBy('position')->get(),
            ),
        ]);
    }
}
