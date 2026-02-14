<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Brand;
use App\Models\BrandModel;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    protected $model = Listing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2015, 2024);
        $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']); // 80% used
        $mileage = $condition === 'new' ? fake()->numberBetween(0, 500) : fake()->numberBetween(10000, 500000);
        $fuelTypes = ['diesel', 'petrol', 'electric', 'hybrid', 'lpg', 'cng'];
        $transmissions = ['manual', 'automatic', 'semi_automatic'];
        $emissionClasses = ['euro3', 'euro4', 'euro5', 'euro6', 'euro6d'];
        $colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Grey', 'Beige'];

        $statusRoll = fake()->numberBetween(1, 100);
        if ($statusRoll <= 80) {
            $status = 'active';
        } elseif ($statusRoll <= 90) {
            $status = 'pending_review';
        } else {
            $status = 'draft';
        }

        $publishedAt = $status === 'active'
            ? fake()->dateTimeBetween('-6 months', 'now')
            : null;

        return [
            'title' => 'Default Listing Title',
            'slug' => fake()->unique()->slug(6),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->numberBetween(5000, 150000),
            'currency' => 'EUR',
            'price_negotiable' => fake()->boolean(40),
            'condition' => $condition,
            'year' => $year,
            'mileage' => $mileage,
            'mileage_unit' => 'km',
            'fuel_type' => fake()->randomElement($fuelTypes),
            'transmission' => fake()->randomElement($transmissions),
            'emission_class' => fake()->randomElement($emissionClasses),
            'power_hp' => fake()->numberBetween(100, 650),
            'power_kw' => null, // Will be calculated
            'weight_kg' => fake()->numberBetween(3500, 44000),
            'color' => fake()->randomElement($colors),
            'status' => $status,
            'view_count' => fake()->numberBetween(0, 5000),
            'contact_count' => fake()->numberBetween(0, 50),
            'is_featured' => fake()->boolean(10),
            'published_at' => $publishedAt,
            'expires_at' => $publishedAt ? now()->addMonths(3) : null,
        ];
    }
}
