<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class SellerProfile extends Model
{
    use HasFactory;
    use HasSlug;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'company_name',
        'slug',
        'description',
        'logo',
        'website',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'tax_id',
        'is_verified',
        'verified_at',
        'rating',
        'review_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'rating' => 'decimal:2',
            'review_count' => 'integer',
        ];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('company_name')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function listings(): HasManyThrough
    {
        return $this->hasManyThrough(
            Listing::class,
            User::class,
            'id',          // Foreign key on users table
            'user_id',     // Foreign key on listings table
            'user_id',     // Local key on seller_profiles table
            'id'           // Local key on users table
        );
    }
}
