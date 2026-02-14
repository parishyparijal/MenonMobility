<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MessageThread extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'listing_id',
        'buyer_id',
        'seller_id',
        'subject',
        'is_archived_by_buyer',
        'is_archived_by_seller',
        'last_message_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_archived_by_buyer' => 'boolean',
            'is_archived_by_seller' => 'boolean',
            'last_message_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'thread_id')->orderBy('created_at');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class, 'thread_id')->latestOfMany();
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeForUser($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('buyer_id', $user->id)
                ->orWhere('seller_id', $user->id);
        });
    }

    public function scopeNotArchived($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('buyer_id', $user->id)->where('is_archived_by_buyer', false);
        })->orWhere(function ($q) use ($user) {
            $q->where('seller_id', $user->id)->where('is_archived_by_seller', false);
        });
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function involvesUser(User $user): bool
    {
        return $this->buyer_id === $user->id || $this->seller_id === $user->id;
    }
}
