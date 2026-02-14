<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Http\Resources\SellerProfileResource;
use App\Models\SellerProfile;
use Illuminate\Http\JsonResponse;

class SellerController extends Controller
{
    /**
     * Show a public seller profile with active listings count.
     */
    public function show(string $slug): JsonResponse
    {
        $sellerProfile = SellerProfile::query()
            ->where('slug', $slug)
            ->with('user')
            ->firstOrFail();

        // Count only active listings
        $activeListingsCount = $sellerProfile->listings()
            ->where('status', ListingStatus::Active)
            ->count();

        // Load some active listings for preview
        $activeListings = $sellerProfile->listings()
            ->where('status', ListingStatus::Active)
            ->with(['images', 'category', 'brand'])
            ->latest()
            ->limit(12)
            ->get();

        return response()->json([
            'data' => [
                'profile' => new SellerProfileResource($sellerProfile),
                'active_listings_count' => $activeListingsCount,
                'listings' => ListingResource::collection($activeListings),
            ],
        ]);
    }
}
