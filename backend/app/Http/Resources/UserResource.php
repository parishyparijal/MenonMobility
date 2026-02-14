<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role->value,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'seller_profile' => $this->when(
                $this->relationLoaded('sellerProfile') && $this->sellerProfile,
                fn () => new SellerProfileResource($this->sellerProfile),
            ),
        ];
    }
}
