<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FavoriteController extends Controller
{
    /**
     * List the authenticated user's favorited listings.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $favorites = $request->user()
            ->favorites()
            ->with(['listing.images', 'listing.category', 'listing.brand', 'listing.user.sellerProfile'])
            ->latest()
            ->paginate(24);

        // Transform to listing resources
        $listings = $favorites->through(fn ($favorite) => $favorite->listing);

        return ListingResource::collection($listings);
    }

    /**
     * Add a listing to the authenticated user's favorites.
     */
    public function store(Request $request, Listing $listing): JsonResponse
    {
        $user = $request->user();

        if ($user->hasFavorited($listing)) {
            return response()->json([
                'message' => 'Listing is already in your favorites.',
            ], 409);
        }

        $user->favorites()->create([
            'listing_id' => $listing->id,
        ]);

        $listing->increment('favorite_count');

        return response()->json([
            'message' => 'Listing added to favorites.',
        ], 201);
    }

    /**
     * Remove a listing from the authenticated user's favorites.
     */
    public function destroy(Request $request, Listing $listing): JsonResponse
    {
        $user = $request->user();

        $deleted = $user->favorites()
            ->where('listing_id', $listing->id)
            ->delete();

        if ($deleted === 0) {
            return response()->json([
                'message' => 'Listing was not in your favorites.',
            ], 404);
        }

        $listing->decrement('favorite_count');

        return response()->json([
            'message' => 'Listing removed from favorites.',
        ]);
    }
}
