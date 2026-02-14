<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\ElasticsearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

class RemoveListingFromElasticsearch implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;

    public function __construct(
        public readonly int $listingId,
    ) {}

    /**
     * Remove the listing document from the Elasticsearch index.
     */
    public function handle(ElasticsearchService $elasticsearchService): void
    {
        $elasticsearchService->removeListing($this->listingId);
    }
}
