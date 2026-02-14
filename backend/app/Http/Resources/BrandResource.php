<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
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
            'slug' => $this->slug,
            'logo_url' => $this->logo_url,
            'is_active' => $this->is_active,
            'models' => $this->when($this->relationLoaded('models'), fn () => $this->models->map(fn ($model) => [
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'is_active' => $model->is_active,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
