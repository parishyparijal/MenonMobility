<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'listing_id',
        'path',
        'url',
        'thumbnail_url',
        'alt_text',
        'position',
        'is_primary',
        'file_size',
        'mime_type',
        'width',
        'height',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_primary' => 'boolean',
            'file_size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOrdered($query)
    {
        return $query->orderBy('position');
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }
}
