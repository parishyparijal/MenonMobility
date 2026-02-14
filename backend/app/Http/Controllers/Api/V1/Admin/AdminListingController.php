<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminListingController extends Controller
{
    /**
     * List all listings with filters (status, date range).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Listing::query()
            ->with(['images', 'category', 'brand', 'brandModel', 'user.sellerProfile']);

        // Filter by status
        if ($request->filled('status')) {
            $status = ListingStatus::tryFrom($request->input('status'));
            if ($status) {
                $query->where('status', $status);
            }
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->input('date_to'));
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->input('user_id'));
        }

        $perPage = min((int) $request->input('per_page', 25), 100);

        return ListingResource::collection(
            $query->latest()->paginate($perPage),
        );
    }

    /**
     * Approve a listing (set status to active, set published_at).
     */
    public function approve(Listing $listing): JsonResponse
    {
        if ($listing->status !== ListingStatus::PendingReview) {
            return response()->json([
                'message' => 'Only listings with pending_review status can be approved.',
            ], 422);
        }

        $listing->update([
            'status' => ListingStatus::Active,
            'published_at' => now(),
            'rejected_reason' => null,
        ]);

        return response()->json([
            'message' => 'Listing approved and published.',
            'data' => new ListingResource($listing->load(['images', 'category', 'brand'])),
        ]);
    }

    /**
     * Reject a listing with a reason.
     */
    public function reject(RejectListingRequest $request, Listing $listing): JsonResponse
    {
        if ($listing->status !== ListingStatus::PendingReview) {
            return response()->json([
                'message' => 'Only listings with pending_review status can be rejected.',
            ], 422);
        }

        $listing->update([
            'status' => ListingStatus::Rejected,
            'rejected_reason' => $request->validated('reason'),
        ]);

        return response()->json([
            'message' => 'Listing rejected.',
            'data' => new ListingResource($listing->load(['images', 'category', 'brand'])),
        ]);
    }
}
