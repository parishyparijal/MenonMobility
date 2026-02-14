<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\SavedSearch;
use App\Services\ElasticsearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSavedSearchAlerts implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $frequency = 'daily',
    ) {}

    /**
     * Fetch saved searches matching the frequency, run each against
     * Elasticsearch, and email the user if there are new listings.
     */
    public function handle(ElasticsearchService $elasticsearchService): void
    {
        $savedSearches = SavedSearch::query()
            ->notifiable()
            ->where('notify_frequency', $this->frequency)
            ->with('user')
            ->cursor();

        foreach ($savedSearches as $savedSearch) {
            /** @var SavedSearch $savedSearch */
            $filters = $savedSearch->filters ?? [];
            $filters['status'] = 'active';

            $results = $elasticsearchService->search($filters);

            // Only keep listings created after the last notification
            $newListings = collect($results['hits'])->filter(function (array $hit) use ($savedSearch): bool {
                if (! $savedSearch->last_notified_at) {
                    return true;
                }

                $createdAt = $hit['created_at'] ?? null;

                return $createdAt !== null
                    && $savedSearch->last_notified_at->lt($createdAt);
            });

            if ($newListings->isEmpty()) {
                continue;
            }

            Mail::send('emails.saved-search-alert', [
                'user' => $savedSearch->user,
                'searchName' => $savedSearch->name,
                'listings' => $newListings->values()->all(),
                'totalNew' => $newListings->count(),
            ], function ($message) use ($savedSearch): void {
                $message->to($savedSearch->user->email)
                    ->subject("New listings matching \"{$savedSearch->name}\"");
            });

            $savedSearch->update(['last_notified_at' => now()]);
        }
    }
}
