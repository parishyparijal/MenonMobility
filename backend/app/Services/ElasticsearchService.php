<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Listing;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Illuminate\Support\Arr;

class ElasticsearchService
{
    private const INDEX_NAME = 'listings';

    public function __construct(
        private readonly Client $client,
    ) {}

    // -------------------------------------------------------------------------
    // Index Management
    // -------------------------------------------------------------------------

    /**
     * Create the listings index with full mapping, analyzers, and synonym filters.
     */
    public function createIndex(): void
    {
        $this->client->indices()->create([
            'index' => self::INDEX_NAME,
            'body' => [
                'settings' => [
                    'number_of_shards' => 3,
                    'number_of_replicas' => 1,
                    'analysis' => [
                        'filter' => [
                            'truck_synonyms' => [
                                'type' => 'synonym',
                                'synonyms' => [
                                    'truck,lorry,hgv',
                                    'merc,mercedes-benz',
                                    'trailer,semi-trailer',
                                ],
                            ],
                            'edge_ngram_filter' => [
                                'type' => 'edge_ngram',
                                'min_gram' => 2,
                                'max_gram' => 15,
                            ],
                        ],
                        'analyzer' => [
                            'autocomplete_analyzer' => [
                                'type' => 'custom',
                                'tokenizer' => 'standard',
                                'filter' => [
                                    'lowercase',
                                    'edge_ngram_filter',
                                ],
                            ],
                            'autocomplete_search_analyzer' => [
                                'type' => 'custom',
                                'tokenizer' => 'standard',
                                'filter' => [
                                    'lowercase',
                                ],
                            ],
                            'synonym_analyzer' => [
                                'type' => 'custom',
                                'tokenizer' => 'standard',
                                'filter' => [
                                    'lowercase',
                                    'truck_synonyms',
                                ],
                            ],
                        ],
                    ],
                ],
                'mappings' => [
                    'properties' => [
                        'title' => [
                            'type' => 'text',
                            'analyzer' => 'autocomplete_analyzer',
                            'search_analyzer' => 'autocomplete_search_analyzer',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                ],
                            ],
                        ],
                        'description' => [
                            'type' => 'text',
                            'analyzer' => 'synonym_analyzer',
                        ],
                        'brand_name' => [
                            'type' => 'text',
                            'analyzer' => 'synonym_analyzer',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                ],
                            ],
                        ],
                        'model_name' => [
                            'type' => 'text',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                ],
                            ],
                        ],
                        'category_name' => [
                            'type' => 'keyword',
                        ],
                        'category_slug' => [
                            'type' => 'keyword',
                        ],
                        'price' => [
                            'type' => 'float',
                        ],
                        'year' => [
                            'type' => 'integer',
                        ],
                        'mileage_km' => [
                            'type' => 'integer',
                        ],
                        'condition' => [
                            'type' => 'keyword',
                        ],
                        'fuel_type' => [
                            'type' => 'keyword',
                        ],
                        'transmission' => [
                            'type' => 'keyword',
                        ],
                        'emission_class' => [
                            'type' => 'keyword',
                        ],
                        'country_code' => [
                            'type' => 'keyword',
                        ],
                        'city' => [
                            'type' => 'keyword',
                        ],
                        'region' => [
                            'type' => 'keyword',
                        ],
                        'location' => [
                            'type' => 'geo_point',
                        ],
                        'status' => [
                            'type' => 'keyword',
                        ],
                        'power_hp' => [
                            'type' => 'integer',
                        ],
                        'gvw_kg' => [
                            'type' => 'integer',
                        ],
                        'image_url' => [
                            'type' => 'keyword',
                            'index' => false,
                        ],
                        'seller_name' => [
                            'type' => 'text',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                ],
                            ],
                        ],
                        'created_at' => [
                            'type' => 'date',
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * Delete the listings index.
     */
    public function deleteIndex(): void
    {
        try {
            $this->client->indices()->delete(['index' => self::INDEX_NAME]);
        } catch (ClientResponseException $e) {
            if ($e->getCode() !== 404) {
                throw $e;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Document Operations
    // -------------------------------------------------------------------------

    /**
     * Index a single listing document into Elasticsearch.
     */
    public function indexListing(Listing $listing): void
    {
        $listing->loadMissing(['brand', 'brandModel', 'category', 'location', 'primaryImage', 'user.sellerProfile']);

        $document = [
            'title' => $listing->title,
            'description' => $listing->description,
            'brand_name' => $listing->brand?->name,
            'model_name' => $listing->brandModel?->name,
            'category_name' => $listing->category?->name,
            'category_slug' => $listing->category?->slug,
            'price' => (float) $listing->price,
            'year' => $listing->year,
            'mileage_km' => $listing->mileage,
            'condition' => $listing->condition?->value,
            'fuel_type' => $listing->fuel_type?->value,
            'transmission' => $listing->transmission?->value,
            'emission_class' => $listing->emission_class?->value,
            'country_code' => $listing->location?->country,
            'city' => $listing->location?->city,
            'region' => $listing->location?->state,
            'status' => $listing->status?->value,
            'power_hp' => $listing->power_hp,
            'gvw_kg' => $listing->weight_kg,
            'image_url' => $listing->primaryImage?->thumbnail_url,
            'seller_name' => $listing->user?->sellerProfile?->company_name ?? $listing->user?->name,
            'created_at' => $listing->created_at?->toIso8601String(),
        ];

        // Add geo_point only when coordinates are available
        if ($listing->location?->latitude && $listing->location?->longitude) {
            $document['location'] = [
                'lat' => (float) $listing->location->latitude,
                'lon' => (float) $listing->location->longitude,
            ];
        }

        $this->client->index([
            'index' => self::INDEX_NAME,
            'id' => $listing->id,
            'body' => $document,
        ]);
    }

    /**
     * Remove a listing from the index by its ID.
     */
    public function removeListing(int $listingId): void
    {
        try {
            $this->client->delete([
                'index' => self::INDEX_NAME,
                'id' => $listingId,
            ]);
        } catch (ClientResponseException $e) {
            if ($e->getCode() !== 404) {
                throw $e;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Search
    // -------------------------------------------------------------------------

    /**
     * Execute a full search query with filters, aggregations, and sorting.
     *
     * @param  array<string, mixed>  $params
     * @return array{hits: array<int, array<string, mixed>>, aggregations: array<string, mixed>, total: int}
     */
    public function search(array $params): array
    {
        $body = $this->buildSearchBody($params);

        $response = $this->client->search([
            'index' => self::INDEX_NAME,
            'body' => $body,
        ]);

        $data = $response->asArray();

        $hits = array_map(
            fn (array $hit): array => array_merge(
                $hit['_source'],
                ['_id' => $hit['_id'], '_score' => $hit['_score'] ?? null]
            ),
            $data['hits']['hits'] ?? [],
        );

        return [
            'hits' => $hits,
            'aggregations' => $data['aggregations'] ?? [],
            'total' => $data['hits']['total']['value'] ?? 0,
        ];
    }

    /**
     * Return autocomplete / edge-ngram suggestions for the given query.
     *
     * @return array<int, array{text: string, score: float}>
     */
    public function suggest(string $query): array
    {
        $response = $this->client->search([
            'index' => self::INDEX_NAME,
            'body' => [
                'size' => 0,
                'query' => [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['title', 'brand_name'],
                        'type' => 'bool_prefix',
                    ],
                ],
                'aggs' => [
                    'title_suggestions' => [
                        'terms' => [
                            'field' => 'title.keyword',
                            'size' => 5,
                        ],
                    ],
                    'brand_suggestions' => [
                        'terms' => [
                            'field' => 'brand_name.keyword',
                            'size' => 5,
                        ],
                    ],
                ],
            ],
        ]);

        $data = $response->asArray();
        $suggestions = [];

        foreach ($data['aggregations']['title_suggestions']['buckets'] ?? [] as $bucket) {
            $suggestions[] = [
                'text' => $bucket['key'],
                'score' => (float) $bucket['doc_count'],
            ];
        }

        foreach ($data['aggregations']['brand_suggestions']['buckets'] ?? [] as $bucket) {
            $suggestions[] = [
                'text' => $bucket['key'],
                'score' => (float) $bucket['doc_count'],
            ];
        }

        // Sort by score descending and remove duplicates
        usort($suggestions, fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        return array_values(
            collect($suggestions)->unique('text')->take(10)->all()
        );
    }

    // -------------------------------------------------------------------------
    // Private Helpers
    // -------------------------------------------------------------------------

    /**
     * Build the Elasticsearch query body from the given parameters.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    private function buildSearchBody(array $params): array
    {
        $must = [];
        $filter = [];

        // Full-text search
        if ($query = Arr::get($params, 'q')) {
            $must[] = [
                'multi_match' => [
                    'query' => $query,
                    'fields' => [
                        'title^3',
                        'brand_name^2',
                        'model_name^2',
                        'description',
                    ],
                    'type' => 'best_fields',
                    'fuzziness' => 'AUTO',
                ],
            ];
        }

        // Term filters
        $termFields = [
            'category' => 'category_slug',
            'brand' => 'brand_name.keyword',
            'condition' => 'condition',
            'fuel_type' => 'fuel_type',
            'transmission' => 'transmission',
            'emission_class' => 'emission_class',
            'country' => 'country_code',
            'city' => 'city',
            'status' => 'status',
        ];

        foreach ($termFields as $paramKey => $esField) {
            if ($value = Arr::get($params, $paramKey)) {
                $filter[] = ['term' => [$esField => $value]];
            }
        }

        // Range filters
        $rangeFields = [
            ['min_price', 'max_price', 'price'],
            ['min_year', 'max_year', 'year'],
            ['min_mileage', 'max_mileage', 'mileage_km'],
            ['min_power', 'max_power', 'power_hp'],
        ];

        foreach ($rangeFields as [$minParam, $maxParam, $esField]) {
            $range = [];
            if (($min = Arr::get($params, $minParam)) !== null) {
                $range['gte'] = $min;
            }
            if (($max = Arr::get($params, $maxParam)) !== null) {
                $range['lte'] = $max;
            }
            if ($range !== []) {
                $filter[] = ['range' => [$esField => $range]];
            }
        }

        // Geo-distance filter
        $lat = Arr::get($params, 'lat');
        $lng = Arr::get($params, 'lng');
        $radius = Arr::get($params, 'radius', '50km');

        if ($lat !== null && $lng !== null) {
            $filter[] = [
                'geo_distance' => [
                    'distance' => is_numeric($radius) ? "{$radius}km" : $radius,
                    'location' => [
                        'lat' => (float) $lat,
                        'lon' => (float) $lng,
                    ],
                ],
            ];
        }

        // Build bool query
        $boolQuery = [];
        if ($must !== []) {
            $boolQuery['must'] = $must;
        }
        if ($filter !== []) {
            $boolQuery['filter'] = $filter;
        }

        $body = [
            'query' => $boolQuery !== [] ? ['bool' => $boolQuery] : ['match_all' => (object) []],
        ];

        // Aggregations
        $body['aggs'] = [
            'brands' => [
                'terms' => [
                    'field' => 'brand_name.keyword',
                    'size' => 50,
                ],
            ],
            'categories' => [
                'terms' => [
                    'field' => 'category_slug',
                    'size' => 30,
                ],
            ],
            'fuel_types' => [
                'terms' => [
                    'field' => 'fuel_type',
                    'size' => 20,
                ],
            ],
            'conditions' => [
                'terms' => [
                    'field' => 'condition',
                    'size' => 10,
                ],
            ],
            'price_ranges' => [
                'range' => [
                    'field' => 'price',
                    'ranges' => [
                        ['key' => 'under_10k', 'to' => 10000],
                        ['key' => '10k_25k', 'from' => 10000, 'to' => 25000],
                        ['key' => '25k_50k', 'from' => 25000, 'to' => 50000],
                        ['key' => '50k_100k', 'from' => 50000, 'to' => 100000],
                        ['key' => '100k_250k', 'from' => 100000, 'to' => 250000],
                        ['key' => 'over_250k', 'from' => 250000],
                    ],
                ],
            ],
            'year_ranges' => [
                'range' => [
                    'field' => 'year',
                    'ranges' => [
                        ['key' => 'before_2010', 'to' => 2010],
                        ['key' => '2010_2015', 'from' => 2010, 'to' => 2016],
                        ['key' => '2016_2020', 'from' => 2016, 'to' => 2021],
                        ['key' => '2021_present', 'from' => 2021],
                    ],
                ],
            ],
        ];

        // Sorting
        $body['sort'] = match (Arr::get($params, 'sort')) {
            'price_asc' => [['price' => 'asc'], '_score'],
            'price_desc' => [['price' => 'desc'], '_score'],
            'date_desc' => [['created_at' => 'desc'], '_score'],
            'year_desc' => [['year' => 'desc'], '_score'],
            'mileage_asc' => [['mileage_km' => 'asc'], '_score'],
            default => ['_score', ['created_at' => 'desc']], // relevance
        };

        // Pagination
        $page = max(1, (int) Arr::get($params, 'page', 1));
        $perPage = min(100, max(1, (int) Arr::get($params, 'per_page', 20)));

        $body['from'] = ($page - 1) * $perPage;
        $body['size'] = $perPage;

        return $body;
    }
}
