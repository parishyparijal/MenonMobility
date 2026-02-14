<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -----------------------------------------------------------------
        // Admin user
        // -----------------------------------------------------------------
        User::create([
            'name' => 'Admin',
            'email' => 'admin@menontrucks.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // -----------------------------------------------------------------
        // Seller accounts with profiles
        // -----------------------------------------------------------------
        $sellers = [
            [
                'user' => [
                    'name' => 'Jan van der Berg',
                    'email' => 'seller1@test.com',
                    'phone' => '+31612345001',
                ],
                'profile' => [
                    'company_name' => 'Van der Berg Trucks',
                    'slug' => 'van-der-berg-trucks',
                    'description' => 'Leading truck dealer in the Netherlands with over 25 years of experience. We specialize in premium used trucks from all major European brands. Our certified pre-owned vehicles come with comprehensive warranty and inspection reports.',
                    'phone' => '+31612345001',
                    'address' => 'Industrieweg 45',
                    'city' => 'Rotterdam',
                    'country' => 'NL',
                    'postal_code' => '3045 AE',
                    'latitude' => 51.92442000,
                    'longitude' => 4.47773000,
                    'is_verified' => true,
                    'verified_at' => now(),
                    'rating' => 4.8,
                    'review_count' => 127,
                ],
            ],
            [
                'user' => [
                    'name' => 'Thomas Schmidt',
                    'email' => 'seller2@test.com',
                    'phone' => '+49172345002',
                ],
                'profile' => [
                    'company_name' => 'European Transport Solutions',
                    'slug' => 'european-transport-solutions',
                    'description' => 'Your one-stop shop for commercial vehicle solutions across Europe. We offer trucks, trailers, and complete transport packages. Financing and leasing options available for all our vehicles.',
                    'phone' => '+49172345002',
                    'address' => 'Hafenstraße 12',
                    'city' => 'Hamburg',
                    'country' => 'DE',
                    'postal_code' => '20457',
                    'latitude' => 53.55109000,
                    'longitude' => 9.99368000,
                    'is_verified' => true,
                    'verified_at' => now(),
                    'rating' => 4.6,
                    'review_count' => 89,
                ],
            ],
            [
                'user' => [
                    'name' => 'Erik Lindgren',
                    'email' => 'seller3@test.com',
                    'phone' => '+46731234003',
                ],
                'profile' => [
                    'company_name' => 'Nordic Heavy Machinery',
                    'slug' => 'nordic-heavy-machinery',
                    'description' => 'Specialists in heavy construction equipment and machinery for the Nordic and European markets. We stock excavators, loaders, and dozers from Caterpillar, Komatsu, and Volvo. Full service workshop on site.',
                    'phone' => '+46731234003',
                    'address' => 'Maskinvägen 8',
                    'city' => 'Berlin',
                    'country' => 'DE',
                    'postal_code' => '10115',
                    'latitude' => 52.52001000,
                    'longitude' => 13.40495000,
                    'is_verified' => true,
                    'verified_at' => now(),
                    'rating' => 4.5,
                    'review_count' => 63,
                ],
            ],
            [
                'user' => [
                    'name' => 'Marc Dubois',
                    'email' => 'seller4@test.com',
                    'phone' => '+33612345004',
                ],
                'profile' => [
                    'company_name' => 'Alpine Commercial Vehicles',
                    'slug' => 'alpine-commercial-vehicles',
                    'description' => 'Premium dealer for commercial vehicles based in France. We offer a wide range of trucks, vans, and trailers from top manufacturers. All vehicles undergo a 150-point inspection before sale.',
                    'phone' => '+33612345004',
                    'address' => '27 Rue de l\'Industrie',
                    'city' => 'Lyon',
                    'country' => 'FR',
                    'postal_code' => '69003',
                    'latitude' => 45.76404000,
                    'longitude' => 4.83566000,
                    'is_verified' => true,
                    'verified_at' => now(),
                    'rating' => 4.3,
                    'review_count' => 45,
                ],
            ],
            [
                'user' => [
                    'name' => 'James O\'Brien',
                    'email' => 'seller5@test.com',
                    'phone' => '+44771234005',
                ],
                'profile' => [
                    'company_name' => 'Atlantic Auto Group',
                    'slug' => 'atlantic-auto-group',
                    'description' => 'Family-run commercial vehicle dealership serving the UK and Ireland since 1995. We specialize in quality used trucks and vans with full service history. Nationwide delivery available.',
                    'phone' => '+44771234005',
                    'address' => '15 Commerce Road',
                    'city' => 'London',
                    'country' => 'GB',
                    'postal_code' => 'E14 9TS',
                    'latitude' => 51.50735000,
                    'longitude' => -0.12776000,
                    'is_verified' => false,
                    'rating' => 4.1,
                    'review_count' => 31,
                ],
            ],
        ];

        foreach ($sellers as $sellerData) {
            $user = User::create(array_merge($sellerData['user'], [
                'password' => Hash::make('password'),
                'role' => 'seller',
                'email_verified_at' => now(),
                'is_active' => true,
            ]));

            SellerProfile::create(array_merge($sellerData['profile'], [
                'user_id' => $user->id,
            ]));
        }

        // -----------------------------------------------------------------
        // Buyer accounts
        // -----------------------------------------------------------------
        $buyers = [
            ['name' => 'Peter Müller', 'email' => 'buyer1@test.com', 'phone' => '+49151000001'],
            ['name' => 'Sophie Jansen', 'email' => 'buyer2@test.com', 'phone' => '+31620000002'],
            ['name' => 'Carlos Garcia', 'email' => 'buyer3@test.com', 'phone' => '+34612000003'],
            ['name' => 'Anna Kowalski', 'email' => 'buyer4@test.com', 'phone' => '+48501000004'],
            ['name' => 'David Wilson', 'email' => 'buyer5@test.com', 'phone' => '+44771000005'],
        ];

        foreach ($buyers as $buyerData) {
            User::create(array_merge($buyerData, [
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'email_verified_at' => now(),
                'is_active' => true,
            ]));
        }
    }
}
