<?php

declare(strict_types=1);

namespace App\Events;

use App\Enums\ListingStatus;
use App\Models\Listing;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ListingStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public readonly Listing $listing,
        public readonly ListingStatus $oldStatus,
        public readonly ListingStatus $newStatus,
    ) {}
}
