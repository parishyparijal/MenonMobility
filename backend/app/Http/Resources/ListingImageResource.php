<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'position' => $this->position,
            'urls' => [
                'original' => $this->original_url ? asset('storage/' . $this->original_url) : null,
                'large' => $this->large_url ? asset('storage/' . $this->large_url) : null,
                'medium' => $this->medium_url ? asset('storage/' . $this->medium_url) : null,
                'thumbnail' => $this->thumbnail_url ? asset('storage/' . $this->thumbnail_url) : null,
                'webp' => $this->webp_url ? asset('storage/' . $this->webp_url) : null,
            ],
            'alt_text' => $this->alt_text,
        ];
    }
}
