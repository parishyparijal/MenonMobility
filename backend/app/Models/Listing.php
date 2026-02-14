<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EmissionClass;
use App\Enums\FuelType;
use App\Enums\ListingStatus;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Listing extends Model
{
    use HasFactory;
    use HasSlug;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'brand_id',
        'brand_model_id',
        'location_id',
        'title',
        'slug',
        'description',
        'price',
        'currency',
        'price_negotiable',
        'condition',
        'year',
        'mileage',
        'mileage_unit',
        'fuel_type',
        'transmission',
        'emission_class',
        'power_hp',
        'power_kw',
        'weight_kg',
        'color',
        'vin',
        'registration_number',
        'first_registration_date',
        'inspection_valid_until',
        'status',
        'rejection_reason',
        'view_count',
        'contact_count',
        'is_featured',
        'featured_until',
        'published_at',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'price_negotiable' => 'boolean',
            'condition' => VehicleCondition::class,
            'year' => 'integer',
            'mileage' => 'integer',
            'fuel_type' => FuelType::class,
            'transmission' => TransmissionType::class,
            'emission_class' => EmissionClass::class,
            'power_hp' => 'integer',
            'power_kw' => 'integer',
            'weight_kg' => 'integer',
            'status' => ListingStatus::class,
            'view_count' => 'integer',
            'contact_count' => 'integer',
            'is_featured' => 'boolean',
            'featured_until' => 'datetime',
            'first_registration_date' => 'date',
            'inspection_valid_until' => 'date',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['brand.name', 'brandModel.name', 'year'])
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function brandModel(): BelongsTo
    {
        return $this->belongsTo(BrandModel::class, 'brand_model_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class)->orderBy('position');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ListingImage::class)->where('is_primary', true);
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(ListingSpecification::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function messageThreads(): HasMany
    {
        return $this->hasMany(MessageThread::class);
    }

    public function featuredListing(): HasOne
    {
        return $this->hasOne(FeaturedListing::class);
    }

    // -------------------------------------------------------------------------
    // Status Scopes
    // -------------------------------------------------------------------------

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::Draft);
    }

    public function scopePendingReview(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::PendingReview);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::Active);
    }

    public function scopeSold(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::Sold);
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::Expired);
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', ListingStatus::Rejected);
    }

    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query->whereIn('status', ListingStatus::publicStatuses());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true)
            ->where(function (Builder $q) {
                $q->whereNull('featured_until')
                    ->orWhere('featured_until', '>', now());
            });
    }

    public function scopeNotExpired(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        });
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function incrementContactCount(): void
    {
        $this->increment('contact_count');
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function getPriceFormattedAttribute(): string
    {
        return number_format((float) $this->price, 2) . ' ' . ($this->currency ?? 'EUR');
    }
}
