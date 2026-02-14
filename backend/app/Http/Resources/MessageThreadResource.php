<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MessageThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $authUserId = Auth::id();
        $otherParty = $this->buyer_id === $authUserId ? $this->seller : $this->buyer;

        return [
            'id' => $this->id,
            'listing' => $this->when($this->relationLoaded('listing'), fn () => [
                'id' => $this->listing->id,
                'title' => $this->listing->title,
                'slug' => $this->listing->slug,
                'price' => $this->listing->price ? (float) $this->listing->price : null,
                'thumbnail' => $this->listing->images->first()?->thumbnail_url
                    ? asset('storage/' . $this->listing->images->first()->thumbnail_url)
                    : null,
            ]),
            'other_party' => [
                'id' => $otherParty->id,
                'name' => $otherParty->name,
                'avatar_url' => $otherParty->avatar ? asset('storage/' . $otherParty->avatar) : null,
            ],
            'last_message' => $this->when($this->relationLoaded('latestMessage') && $this->latestMessage, fn () => [
                'id' => $this->latestMessage->id,
                'body' => $this->latestMessage->body,
                'sender_id' => $this->latestMessage->sender_id,
                'is_read' => $this->latestMessage->is_read,
                'created_at' => $this->latestMessage->created_at->toIso8601String(),
            ]),
            'unread_count' => $this->when(
                isset($this->unread_count),
                fn () => $this->unread_count,
            ),
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
