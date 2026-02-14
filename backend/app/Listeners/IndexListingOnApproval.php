<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\ListingApproved;
use App\Jobs\IndexListingInElasticsearch;
use Illuminate\Contracts\Queue\ShouldQueue;

class IndexListingOnApproval implements ShouldQueue
{
    /**
     * Handle the ListingApproved event by dispatching the indexing job.
     */
    public function handle(ListingApproved $event): void
    {
        IndexListingInElasticsearch::dispatch($event->listing);
    }
}
