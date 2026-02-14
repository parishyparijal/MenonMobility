<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Services\ElasticsearchService;
use Illuminate\Console\Command;

class ProcessExpiredListings extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'listings:expire';

    /**
     * The console command description.
     */
    protected $description = 'Mark active listings past their expiration date as expired and remove from search';

    public function __construct(
        private readonly ElasticsearchService $elasticsearch,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredListings = Listing::query()
            ->where('status', ListingStatus::Active)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->get();

        if ($expiredListings->isEmpty()) {
            $this->info('No expired listings found.');

            return self::SUCCESS;
        }

        $count = 0;

        foreach ($expiredListings as $listing) {
            $listing->update(['status' => ListingStatus::Expired]);
            $this->elasticsearch->removeListing($listing->id);
            $count++;
        }

        $this->info("Expired {$count} listing(s) and removed from search index.");

        return self::SUCCESS;
    }
}
