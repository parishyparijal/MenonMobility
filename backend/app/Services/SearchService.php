<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Requests\SearchRequest;

class SearchService
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearch,
    ) {}

    /**
     * Execute a search from a validated SearchRequest, returning formatted results.
     *
     * @return array{listings: array<int, array<string, mixed>>, aggregations: array<string, mixed>, meta: array<string, mixed>}
     */
    public function search(SearchRequest $request): array
    {
        $params = $this->parseRequestParams($request);

        $results = $this->elasticsearch->search($params);

        $page = max(1, (int) $request->input('page', 1));
        $perPage = min(100, max(1, (int) $request->input('per_page', 20)));
        $total = $results['total'];

        return [
            'listings' => $this->formatHits($results['hits']),
            'aggregations' => $this->formatAggregations($results['aggregations']),
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $total > 0 ? (int) ceil($total / $perPage) : 1,
                'from' => $total > 0 ? (($page - 1) * $perPage) + 1 : 0,
                'to' => min($page * $perPage, $total),
            ],
        ];
    }

    /**
     * Return autocomplete suggestions for a query string.
     *
     * @return array<int, array{text: string, score: float}>
     */
    public function suggest(string $query): array
    {
        return $this->elasticsearch->suggest($query);
    }

    // -------------------------------------------------------------------------
    // Private Helpers
    // -------------------------------------------------------------------------

    /**
     * Map SearchRequest input to the params array expected by ElasticsearchService.
     *
     * @return array<string, mixed>
     */
    private function parseRequestParams(SearchRequest $request): array
    {
        return array_filter([
            'q' => $request->input('q'),
            'category' => $request->input('category'),
            'brand' => $request->input('brand'),
            'model' => $request->input('model'),
            'min_price' => $request->input('min_price'),
            'max_price' => $request->input('max_price'),
            'min_year' => $request->input('min_year'),
            'max_year' => $request->input('max_year'),
            'condition' => $request->input('condition'),
            'fuel_type' => $request->input('fuel_type'),
            'transmission' => $request->input('transmission'),
            'country' => $request->input('country'),
            'sort' => $request->input('sort', 'relevance'),
            'page' => $request->input('page', 1),
            'per_page' => $request->input('per_page', 20),
        ], fn (mixed $value): bool => $value !== null && $value !== '');
    }

    /**
     * Format raw Elasticsearch hits into a clean array of listing data.
     *
     * @param  array<int, array<string, mixed>>  $hits
     * @return array<int, array<string, mixed>>
     */
    private function formatHits(array $hits): array
    {
        return array_map(fn (array $hit): array => [
            'id' => (int) $hit['_id'],
            'title' => $hit['title'] ?? null,
            'description' => $hit['description'] ?? null,
            'brand_name' => $hit['brand_name'] ?? null,
            'model_name' => $hit['model_name'] ?? null,
            'category_name' => $hit['category_name'] ?? null,
            'category_slug' => $hit['category_slug'] ?? null,
            'price' => $hit['price'] ?? null,
            'year' => $hit['year'] ?? null,
            'mileage_km' => $hit['mileage_km'] ?? null,
            'condition' => $hit['condition'] ?? null,
            'fuel_type' => $hit['fuel_type'] ?? null,
            'transmission' => $hit['transmission'] ?? null,
            'emission_class' => $hit['emission_class'] ?? null,
            'country_code' => $hit['country_code'] ?? null,
            'city' => $hit['city'] ?? null,
            'power_hp' => $hit['power_hp'] ?? null,
            'image_url' => $hit['image_url'] ?? null,
            'seller_name' => $hit['seller_name'] ?? null,
            'created_at' => $hit['created_at'] ?? null,
            'relevance_score' => $hit['_score'] ?? null,
        ], $hits);
    }

    /**
     * Format raw Elasticsearch aggregations into a frontend-friendly structure.
     *
     * @param  array<string, mixed>  $aggregations
     * @return array<string, mixed>
     */
    private function formatAggregations(array $aggregations): array
    {
        $formatted = [];

        // Term-based aggregations
        $termAggs = ['brands', 'categories', 'fuel_types', 'conditions'];

        foreach ($termAggs as $key) {
            if (isset($aggregations[$key]['buckets'])) {
                $formatted[$key] = array_map(
                    fn (array $bucket): array => [
                        'key' => $bucket['key'],
                        'count' => $bucket['doc_count'],
                    ],
                    $aggregations[$key]['buckets'],
                );
            }
        }

        // Range-based aggregations
        $rangeAggs = ['price_ranges', 'year_ranges'];

        foreach ($rangeAggs as $key) {
            if (isset($aggregations[$key]['buckets'])) {
                $formatted[$key] = array_map(
                    fn (array $bucket): array => [
                        'key' => $bucket['key'],
                        'count' => $bucket['doc_count'],
                        'from' => $bucket['from'] ?? null,
                        'to' => $bucket['to'] ?? null,
                    ],
                    $aggregations[$key]['buckets'],
                );
            }
        }

        return $formatted;
    }
}
