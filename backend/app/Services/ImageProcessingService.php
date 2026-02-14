<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\AutoEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;

class ImageProcessingService
{
    /** @var array<string, array{width: int, height: int|null, crop: bool}> */
    private const SIZES = [
        'original' => ['width' => 2400, 'height' => null, 'crop' => false],
        'large' => ['width' => 1200, 'height' => null, 'crop' => false],
        'medium' => ['width' => 600, 'height' => null, 'crop' => false],
        'thumbnail' => ['width' => 300, 'height' => 225, 'crop' => true],
    ];

    public function __construct(
        private readonly ImageManager $imageManager,
    ) {}

    /**
     * Process a listing image: generate all sizes + WebP variants, upload to S3.
     */
    public function processListingImage(string $tempPath, Listing $listing, int $position): ListingImage
    {
        $image = $this->imageManager->read($tempPath);
        $urls = [];

        foreach (self::SIZES as $sizeName => $config) {
            $resized = $this->resizeImage(clone $image, $config);

            // Original format (JPEG)
            $jpgPath = $this->storagePath($listing->id, $sizeName, $position, 'jpg');
            $jpgData = $resized->encode(new AutoEncoder(quality: 85));
            Storage::disk('s3')->put($jpgPath, (string) $jpgData, 'public');
            $urls["{$sizeName}_url"] = Storage::disk('s3')->url($jpgPath);

            // WebP variant
            $webpPath = $this->storagePath($listing->id, $sizeName, $position, 'webp');
            $webpData = $resized->encode(new WebpEncoder(quality: 82));
            Storage::disk('s3')->put($webpPath, (string) $webpData, 'public');
            $urls["{$sizeName}_webp_url"] = Storage::disk('s3')->url($webpPath);
        }

        // Get dimensions from original-size image for metadata
        $original = $this->resizeImage(clone $image, self::SIZES['original']);
        $width = $original->width();
        $height = $original->height();

        return ListingImage::create([
            'listing_id' => $listing->id,
            'path' => $this->storagePath($listing->id, 'original', $position, 'jpg'),
            'url' => $urls['original_url'],
            'thumbnail_url' => $urls['thumbnail_url'],
            'alt_text' => $listing->title,
            'position' => $position,
            'is_primary' => $position === 0,
            'file_size' => filesize($tempPath) ?: 0,
            'mime_type' => 'image/jpeg',
            'width' => $width,
            'height' => $height,
        ]);
    }

    /**
     * Delete all image sizes from S3 and remove the database record.
     */
    public function deleteListingImage(ListingImage $image): void
    {
        $listingId = $image->listing_id;
        $position = $image->position;

        $pathsToDelete = [];

        foreach (array_keys(self::SIZES) as $sizeName) {
            $pathsToDelete[] = $this->storagePath($listingId, $sizeName, $position, 'jpg');
            $pathsToDelete[] = $this->storagePath($listingId, $sizeName, $position, 'webp');
        }

        Storage::disk('s3')->delete($pathsToDelete);

        $image->delete();
    }

    // -------------------------------------------------------------------------
    // Private Helpers
    // -------------------------------------------------------------------------

    /**
     * Resize or crop an image according to the given size configuration.
     *
     * @param  array{width: int, height: int|null, crop: bool}  $config
     */
    private function resizeImage(ImageInterface $image, array $config): ImageInterface
    {
        if ($config['crop'] && $config['height'] !== null) {
            return $image->cover($config['width'], $config['height']);
        }

        // Scale down preserving aspect ratio; never scale up
        if ($image->width() > $config['width']) {
            return $image->scaleDown(width: $config['width']);
        }

        return $image;
    }

    /**
     * Generate the S3 storage path for an image variant.
     */
    private function storagePath(int $listingId, string $size, int $position, string $extension): string
    {
        return "listings/{$listingId}/{$size}_{$position}.{$extension}";
    }
}
