<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerProfileResource extends JsonResource
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
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'description' => $this->description,
            'website' => $this->website,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'logo_url' => $this->logo ? asset('storage/' . $this->logo) : null,
            'is_verified' => $this->is_verified,
            'verified_at' => $this->verified_at?->toIso8601String(),
            'rating' => $this->rating ? (float) $this->rating : null,
            'review_count' => $this->review_count,
            'listings_count' => $this->when(
                $this->listings_count !== null || $this->relationLoaded('listings'),
                fn () => $this->listings_count ?? $this->listings->count(),
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
