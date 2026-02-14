<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Listing;
use App\Services\ElasticsearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class IndexListingInElasticsearch implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        public readonly Listing $listing,
    ) {}

    /**
     * Index the listing document in Elasticsearch.
     */
    public function handle(ElasticsearchService $elasticsearchService): void
    {
        $elasticsearchService->indexListing($this->listing);
    }
}
