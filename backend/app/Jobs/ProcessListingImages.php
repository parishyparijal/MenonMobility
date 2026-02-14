<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Listing;
use App\Services\ImageProcessingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessListingImages implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @param  array<int, string>  $tempFilePaths  Absolute paths to uploaded temp files.
     */
    public function __construct(
        public readonly Listing $listing,
        public readonly array $tempFilePaths,
    ) {}

    /**
     * Process each uploaded image and update the listing image count.
     */
    public function handle(ImageProcessingService $imageProcessingService): void
    {
        foreach ($this->tempFilePaths as $position => $tempPath) {
            $imageProcessingService->processListingImage($tempPath, $this->listing, $position);
        }

        $this->listing->update([
            'image_count' => $this->listing->images()->count(),
        ]);
    }
}
