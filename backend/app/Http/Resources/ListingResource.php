<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ListingResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,

            // Pricing
            'price' => $this->price ? (float) $this->price : null,
            'price_currency' => $this->price_currency,
            'price_on_request' => $this->price_on_request,

            // Status / condition
            'condition' => $this->condition,
            'status' => $this->status,

            // Vehicle specs
            'year' => $this->year,
            'mileage_km' => $this->mileage_km,
            'hours' => $this->hours,
            'fuel_type' => $this->fuel_type,
            'transmission' => $this->transmission,
            'power_hp' => $this->power_hp,
            'power_kw' => $this->power_kw,
            'color' => $this->color,
            'vin' => $this->vin,

            // Truck-specific
            'gvw_kg' => $this->gvw_kg,
            'payload_kg' => $this->payload_kg,
            'axle_count' => $this->axle_count,
            'cab_type' => $this->cab_type,
            'emission_class' => $this->emission_class,
            'wheelbase_mm' => $this->wheelbase_mm,

            // Location
            'country_code' => $this->country_code,
            'region' => $this->region,
            'city' => $this->city,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,

            // Contact
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'contact_whatsapp' => $this->contact_whatsapp,

            // Counters
            'view_count' => $this->view_count,
            'favorite_count' => $this->favorite_count,
            'image_count' => $this->image_count,

            // Featured
            'is_featured' => $this->is_featured,
            'featured_until' => $this->featured_until?->toIso8601String(),

            // Dates
            'published_at' => $this->published_at?->toIso8601String(),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'sold_at' => $this->sold_at?->toIso8601String(),
            'rejected_reason' => $this->rejected_reason,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Relations
            'images' => ListingImageResource::collection($this->whenLoaded('images')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => $this->when($this->relationLoaded('brand') && $this->brand, fn () => [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
                'logo_url' => $this->brand->logo_url,
            ]),
            'brand_model' => $this->when($this->relationLoaded('brandModel') && $this->brandModel, fn () => [
                'id' => $this->brandModel->id,
                'name' => $this->brandModel->name,
                'slug' => $this->brandModel->slug,
            ]),
            'user' => $this->when($this->relationLoaded('user'), fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar ? asset('storage/' . $this->user->avatar) : null,
            ]),
            'seller_profile' => $this->when(
                $this->relationLoaded('user') && $this->user->relationLoaded('sellerProfile') && $this->user->sellerProfile,
                fn () => new SellerProfileResource($this->user->sellerProfile),
            ),

            // Conditional fields
            'specifications' => $this->when(
                $this->relationLoaded('specifications'),
                fn () => $this->specifications->map(fn ($spec) => [
                    'key' => $spec->specificationKey->name ?? $spec->specification_key_id,
                    'value' => $spec->value,
                ]),
            ),
            'is_favorited' => $this->when(
                Auth::check(),
                fn () => Auth::user()->hasFavorited($this->resource),
            ),
        ];
    }
}
