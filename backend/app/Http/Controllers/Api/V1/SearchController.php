<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Services\ElasticsearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearch,
    ) {}

    /**
     * Full-text search using Elasticsearch with aggregations.
     */
    public function search(SearchRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $perPage = min((int) ($validated['per_page'] ?? 24), 100);
        $page = max((int) ($validated['page'] ?? 1), 1);

        $results = $this->elasticsearch->search(
            query: $validated['q'] ?? '',
            filters: [
                'category' => $validated['category'] ?? null,
                'brand' => $validated['brand'] ?? null,
                'model' => $validated['model'] ?? null,
                'min_price' => isset($validated['min_price']) ? (float) $validated['min_price'] : null,
                'max_price' => isset($validated['max_price']) ? (float) $validated['max_price'] : null,
                'min_year' => isset($validated['min_year']) ? (int) $validated['min_year'] : null,
                'max_year' => isset($validated['max_year']) ? (int) $validated['max_year'] : null,
                'condition' => $validated['condition'] ?? null,
                'fuel_type' => $validated['fuel_type'] ?? null,
                'transmission' => $validated['transmission'] ?? null,
                'country' => $validated['country'] ?? null,
            ],
            sort: $validated['sort'] ?? 'relevance',
            page: $page,
            perPage: $perPage,
        );

        // Hydrate listing models from ES result IDs
        $listingIds = collect($results['hits'])->pluck('id')->toArray();

        $listings = Listing::query()
            ->whereIn('id', $listingIds)
            ->with(['images', 'category', 'brand', 'brandModel', 'user.sellerProfile'])
            ->get()
            ->sortBy(fn (Listing $listing) => array_search($listing->id, $listingIds));

        return response()->json([
            'data' => ListingResource::collection($listings),
            'aggregations' => [
                'brands' => $results['aggregations']['brands'] ?? [],
                'categories' => $results['aggregations']['categories'] ?? [],
                'price_ranges' => $results['aggregations']['price_ranges'] ?? [],
                'year_ranges' => $results['aggregations']['year_ranges'] ?? [],
                'fuel_types' => $results['aggregations']['fuel_types'] ?? [],
            ],
            'meta' => [
                'total' => $results['total'] ?? 0,
                'page' => $page,
                'per_page' => $perPage,
                'last_page' => (int) ceil(($results['total'] ?? 0) / $perPage),
            ],
        ]);
    }

    /**
     * Autocomplete suggestions from Elasticsearch edge ngram.
     */
    public function suggestions(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json(['data' => []]);
        }

        $suggestions = $this->elasticsearch->suggest(
            query: $query,
            limit: (int) $request->input('limit', 10),
        );

        return response()->json([
            'data' => $suggestions,
        ]);
    }
}
