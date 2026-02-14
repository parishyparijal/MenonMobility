<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ListingController extends Controller
{
    /**
     * List paginated active listings with filters.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Listing::query()
            ->where('status', ListingStatus::Active)
            ->with(['images', 'category', 'brand', 'brandModel', 'user.sellerProfile']);

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->input('category')));
        }

        // Filter by brand
        if ($request->filled('brand')) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $request->input('brand')));
        }

        // Filter by condition
        if ($request->filled('condition')) {
            $query->where('condition', $request->input('condition'));
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        // Filter by year range
        if ($request->filled('min_year')) {
            $query->where('year', '>=', (int) $request->input('min_year'));
        }
        if ($request->filled('max_year')) {
            $query->where('year', '<=', (int) $request->input('max_year'));
        }

        // Filter by country
        if ($request->filled('country')) {
            $query->where('country_code', $request->input('country'));
        }

        // Sorting
        $sort = $request->input('sort', 'date_desc');
        $query = match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'year_desc' => $query->orderBy('year', 'desc'),
            'mileage_asc' => $query->orderBy('mileage_km', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $perPage = min((int) $request->input('per_page', 24), 100);

        return ListingResource::collection($query->paginate($perPage));
    }

    /**
     * Show a single listing by slug with all relations.
     * View count is incremented via TrackListingView middleware.
     */
    public function show(string $slug): JsonResponse
    {
        $listing = Listing::query()
            ->where('slug', $slug)
            ->where('status', ListingStatus::Active)
            ->with([
                'images',
                'category',
                'brand',
                'brandModel',
                'user.sellerProfile',
                'specifications.specificationKey',
            ])
            ->firstOrFail();

        // Increment view count with rate limiting per IP
        $ip = request()->ip();
        $cacheKey = "listing_view:{$listing->id}:{$ip}";

        if (! Cache::has($cacheKey)) {
            Cache::put($cacheKey, true, now()->addMinutes(30));
            $listing->increment('view_count');
        }

        return response()->json([
            'data' => new ListingResource($listing),
        ]);
    }
}
