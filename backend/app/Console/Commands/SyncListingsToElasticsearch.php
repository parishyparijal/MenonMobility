<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Services\ElasticsearchService;
use Illuminate\Console\Command;

class SyncListingsToElasticsearch extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'listings:sync {--fresh : Delete and recreate the index before syncing}';

    /**
     * The console command description.
     */
    protected $description = 'Sync all active listings to the Elasticsearch index';

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
        if ($this->option('fresh')) {
            $this->info('Deleting existing index...');
            $this->elasticsearch->deleteIndex();

            $this->info('Creating fresh index with mappings...');
            $this->elasticsearch->createIndex();
        }

        $query = Listing::query()
            ->where('status', ListingStatus::Active)
            ->with(['brand', 'brandModel', 'category', 'location', 'primaryImage', 'user.sellerProfile']);

        $total = $query->count();

        if ($total === 0) {
            $this->info('No active listings found to index.');

            return self::SUCCESS;
        }

        $this->info("Indexing {$total} active listings...");
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $indexed = 0;

        $query->chunk(200, function ($listings) use (&$indexed, $bar): void {
            foreach ($listings as $listing) {
                $this->elasticsearch->indexListing($listing);
                $indexed++;
                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine(2);
        $this->info("Done. Total listings indexed: {$indexed}");

        return self::SUCCESS;
    }
}
