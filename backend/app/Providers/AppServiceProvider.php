<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\ListingApproved;
use App\Events\MessageSent;
use App\Listeners\IndexListingOnApproval;
use App\Listeners\NotifySellerOnMessage;
use App\Models\Listing;
use App\Models\MessageThread;
use App\Policies\ListingPolicy;
use App\Policies\MessagePolicy;
use App\Services\ElasticsearchService;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Elasticsearch client as a singleton
        $this->app->singleton(Client::class, function (): Client {
            return ClientBuilder::create()
                ->setHosts([config('services.elasticsearch.host', 'localhost:9200')])
                ->build();
        });

        // ElasticsearchService as a singleton (depends on Client)
        $this->app->singleton(ElasticsearchService::class, function ($app): ElasticsearchService {
            return new ElasticsearchService(
                $app->make(Client::class),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(Listing::class, ListingPolicy::class);
        Gate::policy(MessageThread::class, MessagePolicy::class);

        // Register event-listener mappings
        Event::listen(ListingApproved::class, IndexListingOnApproval::class);
        Event::listen(MessageSent::class, NotifySellerOnMessage::class);
    }
}
