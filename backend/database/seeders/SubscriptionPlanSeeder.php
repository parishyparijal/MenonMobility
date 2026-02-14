<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Get started with basic listings. Perfect for individuals selling a few vehicles.',
                'price' => 0.00,
                'currency' => 'EUR',
                'billing_period' => 'monthly',
                'max_listings' => 5,
                'max_images_per_listing' => 5,
                'featured_listings' => 0,
                'features' => [
                    'Up to 5 active listings',
                    '5 images per listing',
                    'Basic search visibility',
                    'Email support',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic-monthly',
                'description' => 'Ideal for small dealers looking to expand their online presence.',
                'price' => 29.99,
                'currency' => 'EUR',
                'billing_period' => 'monthly',
                'max_listings' => 25,
                'max_images_per_listing' => 10,
                'featured_listings' => 0,
                'features' => [
                    'Up to 25 active listings',
                    '10 images per listing',
                    'Enhanced search visibility',
                    'Email support',
                    'Basic analytics',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic-yearly',
                'description' => 'Ideal for small dealers looking to expand their online presence. Save with annual billing.',
                'price' => 299.00,
                'currency' => 'EUR',
                'billing_period' => 'yearly',
                'max_listings' => 25,
                'max_images_per_listing' => 10,
                'featured_listings' => 0,
                'features' => [
                    'Up to 25 active listings',
                    '10 images per listing',
                    'Enhanced search visibility',
                    'Email support',
                    'Basic analytics',
                    '2 months free with annual billing',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional-monthly',
                'description' => 'For established dealers who need maximum exposure and advanced features.',
                'price' => 79.99,
                'currency' => 'EUR',
                'billing_period' => 'monthly',
                'max_listings' => 100,
                'max_images_per_listing' => 20,
                'featured_listings' => 5,
                'features' => [
                    'Up to 100 active listings',
                    '20 images per listing',
                    'Featured placement in search results',
                    '5 featured listings per month',
                    'Priority email & phone support',
                    'Advanced analytics dashboard',
                    'Company profile page',
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional-yearly',
                'description' => 'For established dealers who need maximum exposure. Save with annual billing.',
                'price' => 799.00,
                'currency' => 'EUR',
                'billing_period' => 'yearly',
                'max_listings' => 100,
                'max_images_per_listing' => 20,
                'featured_listings' => 5,
                'features' => [
                    'Up to 100 active listings',
                    '20 images per listing',
                    'Featured placement in search results',
                    '5 featured listings per month',
                    'Priority email & phone support',
                    'Advanced analytics dashboard',
                    'Company profile page',
                    '2 months free with annual billing',
                ],
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise-monthly',
                'description' => 'Unlimited power for large dealerships and fleet operators.',
                'price' => 199.99,
                'currency' => 'EUR',
                'billing_period' => 'monthly',
                'max_listings' => -1, // -1 = unlimited
                'max_images_per_listing' => 20,
                'featured_listings' => 20,
                'features' => [
                    'Unlimited active listings',
                    '20 images per listing',
                    'Featured placement in search results',
                    '20 featured listings per month',
                    'Priority support with dedicated account manager',
                    'Advanced analytics & reporting',
                    'Custom company profile page',
                    'API access for inventory sync',
                    'Bulk import/export tools',
                ],
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise-yearly',
                'description' => 'Unlimited power for large dealerships and fleet operators. Save with annual billing.',
                'price' => 1999.00,
                'currency' => 'EUR',
                'billing_period' => 'yearly',
                'max_listings' => -1, // -1 = unlimited
                'max_images_per_listing' => 20,
                'featured_listings' => 20,
                'features' => [
                    'Unlimited active listings',
                    '20 images per listing',
                    'Featured placement in search results',
                    '20 featured listings per month',
                    'Priority support with dedicated account manager',
                    'Advanced analytics & reporting',
                    'Custom company profile page',
                    'API access for inventory sync',
                    'Bulk import/export tools',
                    '2 months free with annual billing',
                ],
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}
