<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\BrandModel;
use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ListingSeeder extends Seeder
{
    /**
     * Seller user IDs (populated in run()).
     */
    private array $sellerIds = [];

    /**
     * All location IDs (populated in run()).
     */
    private array $locationIds = [];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->sellerIds = User::where('role', 'seller')->pluck('id')->toArray();
        $this->locationIds = Location::pluck('id')->toArray();

        // 150 Trucks
        $this->createTruckListings(150);

        // 100 Trailers
        $this->createTrailerListings(100);

        // 80 Vans
        $this->createVanListings(80);

        // 70 Equipment
        $this->createEquipmentListings(70);

        // 50 Parts
        $this->createPartsListings(50);

        // 50 Cars
        $this->createCarListings(50);
    }

    // =========================================================================
    // Truck Listings (150)
    // =========================================================================

    private function createTruckListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'trucks')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $brands = Brand::whereIn('slug', [
            'mercedes-benz', 'volvo', 'scania', 'man', 'daf', 'iveco', 'renault', 'kenworth', 'peterbilt',
        ])->with('models')->get();

        $truckDescriptions = [
            'Excellent condition, full service history available. One previous owner. Recently serviced with new brake pads and oil change. Equipped with air conditioning, cruise control, and GPS navigation. Ready for immediate use.',
            'Well-maintained fleet vehicle with detailed maintenance records. Regularly serviced at authorized dealer. Features include retarder, air suspension, and electric mirrors. Low hours for the year. Economical and reliable.',
            'This vehicle has been used for long-haul transport and is in great working order. Comes with fresh MOT/TUV inspection. Equipped with Xenon headlights, leather steering wheel, and multi-function display. Financing available.',
            'Ideal for distribution and regional transport. Clean cab interior with no damage. Features include automatic climate control, parking heater, and side skirts for fuel efficiency. Delivery across Europe possible.',
            'Ex-lease vehicle returned in excellent condition. Full dealer service history. Equipped with latest safety features including lane departure warning, emergency braking, and adaptive cruise control. Euro 6 compliant.',
            'Powerful and reliable unit for demanding operations. Heavy-duty chassis with reinforced suspension. Perfect for construction site deliveries or heavy haulage. Comes with PTO and hydraulic connections.',
            'Compact and maneuverable truck perfect for city distribution. Low entry cab for easy access. Equipped with tail lift and roller shutter rear door. Air suspension on rear axle. Very economical on fuel.',
            'Premium specification tractor unit with full options package. Mega cab with microwave, fridge, and flat-screen TV. Long-range fuel tank. Perfect for international transport operations.',
        ];

        $truckConfigs = [
            '4x2', '6x2', '6x4', '8x4', '4x4', '6x2/4',
        ];

        $cabTypes = [
            'Day Cab', 'Sleeper Cab', 'Mega Cab', 'Low Entry Cab', 'Crew Cab',
        ];

        for ($i = 0; $i < $count; $i++) {
            $brand = $brands->random();
            $model = $brand->models->isNotEmpty() ? $brand->models->random() : null;
            $subCategoryId = fake()->randomElement(array_values($subCategories));
            $year = fake()->numberBetween(2015, 2024);
            $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']);
            $config = fake()->randomElement($truckConfigs);
            $cabType = fake()->randomElement($cabTypes);
            $powerHp = fake()->numberBetween(200, 650);

            $modelName = $model ? $model->name : '';
            $title = trim("{$brand->name} {$modelName} {$powerHp} HP {$config} {$cabType}");
            if ($condition === 'new') {
                $title = "NEW {$title}";
            }

            $price = fake()->numberBetween(15000, 150000);
            $mileage = $condition === 'new' ? fake()->numberBetween(0, 500) : fake()->numberBetween(50000, 500000);

            $listing = $this->createListing([
                'category_id' => $subCategoryId,
                'brand_id' => $brand->id,
                'brand_model_id' => $model?->id,
                'title' => $title,
                'description' => fake()->randomElement($truckDescriptions),
                'price' => $price,
                'condition' => $condition,
                'year' => $year,
                'mileage' => $mileage,
                'fuel_type' => fake()->randomElement(['diesel', 'diesel', 'diesel', 'diesel', 'cng', 'electric']),
                'transmission' => fake()->randomElement(['manual', 'automatic', 'semi_automatic']),
                'emission_class' => fake()->randomElement(['euro5', 'euro6', 'euro6', 'euro6d']),
                'power_hp' => $powerHp,
                'power_kw' => (int) round($powerHp * 0.7457),
                'weight_kg' => fake()->numberBetween(7500, 44000),
            ]);

            $this->createListingImages($listing, fake()->numberBetween(2, 5));
        }
    }

    // =========================================================================
    // Trailer Listings (100)
    // =========================================================================

    private function createTrailerListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'trailers')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $trailerBrands = [
            'Schmitz Cargobull', 'Krone', 'Kögel', 'Wielton', 'LAG', 'Fruehauf',
            'Lamberet', 'Chereau', 'Schwarzmüller', 'Fliegl',
        ];

        $trailerDescriptions = [
            'Well-maintained trailer in excellent condition. Floor and walls in good shape with no visible damage. Tyres in good condition with plenty of tread remaining. Suitable for general cargo transport. TUV valid.',
            'This trailer has been fully refurbished including new floor boards, side curtains, and rear doors. All lights and electrical systems checked and working. Ready for immediate operation.',
            'Multi-purpose trailer suitable for various cargo types. Equipped with internal load securing rails, XL code certified, and reinforced side walls. Axles recently serviced with new brake linings.',
            'Low-mileage trailer from single owner. Always garaged when not in use. Original paint in excellent condition. Equipped with lifting axle and air suspension throughout. Very economical to operate.',
            'Heavy-duty trailer built for demanding operations. Reinforced chassis and extra-thick floor. Suitable for machinery transport and heavy palletized goods. Comes with all certification documents.',
            'Temperature-controlled trailer with multi-temperature capability. Carrier/Thermo King unit with low hours. ATP certification valid. Perfect for fresh food and pharmaceutical transport.',
        ];

        for ($i = 0; $i < $count; $i++) {
            $brandName = fake()->randomElement($trailerBrands);
            $subCategoryId = fake()->randomElement(array_values($subCategories));
            $year = fake()->numberBetween(2015, 2024);
            $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']);
            $length = fake()->randomElement(['13.6m', '13.6m', '12m', '15.65m', '7.7m']);

            $subCatSlug = array_search($subCategoryId, $subCategories);
            $typeName = str_replace('-', ' ', ucfirst($subCatSlug ?: 'trailer'));

            $title = "{$brandName} {$typeName} {$length} {$year}";
            if ($condition === 'new') {
                $title = "NEW {$title}";
            }

            $price = fake()->numberBetween(5000, 80000);
            $mileage = $condition === 'new' ? 0 : fake()->numberBetween(10000, 400000);

            $listing = $this->createListing([
                'category_id' => $subCategoryId,
                'brand_id' => null,
                'brand_model_id' => null,
                'title' => $title,
                'description' => fake()->randomElement($trailerDescriptions),
                'price' => $price,
                'condition' => $condition,
                'year' => $year,
                'mileage' => $mileage,
                'fuel_type' => null,
                'transmission' => null,
                'emission_class' => null,
                'power_hp' => null,
                'power_kw' => null,
                'weight_kg' => fake()->numberBetween(5000, 12000),
            ]);

            $this->createListingImages($listing, fake()->numberBetween(2, 5));
        }
    }

    // =========================================================================
    // Van Listings (80)
    // =========================================================================

    private function createVanListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'vans')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $vanBrandModels = [
            'Mercedes-Benz' => ['Sprinter 314', 'Sprinter 316', 'Sprinter 516', 'Vito 114', 'Vito 116'],
            'Volkswagen' => ['Crafter 35', 'Crafter 50', 'Transporter T6.1', 'Caddy Cargo'],
            'Ford' => ['Transit 350', 'Transit 290', 'Transit Custom', 'Transit Connect', 'Ranger'],
            'Renault' => ['Master 150', 'Master 180', 'Trafic', 'Kangoo'],
            'Iveco' => ['Daily 35S14', 'Daily 35S18', 'Daily 50C18', 'Daily 70C18'],
            'Fiat' => ['Ducato 140', 'Ducato 180', 'Talento', 'Doblo Cargo'],
            'Peugeot' => ['Boxer 335', 'Expert', 'Partner'],
            'Citroën' => ['Jumper', 'Dispatch', 'Berlingo Van'],
        ];

        $vanDescriptions = [
            'Reliable panel van perfect for delivery operations. Clean cargo area with no damage. Full service history at authorized dealer. Air conditioning, Bluetooth, and rear parking sensors fitted.',
            'Low mileage van from single corporate owner. Always maintained on schedule. Equipped with wooden floor lining, interior lighting, and load securing rails. Excellent condition inside and out.',
            'High-roof, long-wheelbase van offering maximum cargo capacity. Fitted with racking system and interior lighting. One owner from new. Recent service and MOT. Ready to work.',
            'Refrigerated van with insulated body and standby electric connection. Temperature logs available. Perfect for food delivery and catering businesses. Carrier unit with low hours.',
            'Crew cab van with seating for 6. Full bulkhead behind rear seats. Ideal for construction teams who need to carry tools and equipment. Towbar fitted. Excellent mechanical condition.',
            'Ex-fleet pickup in remarkable condition for the age. Alloy wheels, air conditioning, cruise control, and load liner. Suitable for both work and leisure. Four-wheel drive.',
        ];

        for ($i = 0; $i < $count; $i++) {
            $brandName = fake()->randomElement(array_keys($vanBrandModels));
            $modelName = fake()->randomElement($vanBrandModels[$brandName]);
            $subCategoryId = fake()->randomElement(array_values($subCategories));
            $year = fake()->numberBetween(2016, 2024);
            $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']);
            $powerHp = fake()->numberBetween(100, 210);

            $title = "{$brandName} {$modelName} {$year}";
            if ($condition === 'new') {
                $title = "NEW {$title}";
            }

            $price = fake()->numberBetween(8000, 45000);
            $mileage = $condition === 'new' ? fake()->numberBetween(0, 200) : fake()->numberBetween(20000, 300000);

            $listing = $this->createListing([
                'category_id' => $subCategoryId,
                'brand_id' => null,
                'brand_model_id' => null,
                'title' => $title,
                'description' => fake()->randomElement($vanDescriptions),
                'price' => $price,
                'condition' => $condition,
                'year' => $year,
                'mileage' => $mileage,
                'fuel_type' => fake()->randomElement(['diesel', 'diesel', 'diesel', 'petrol', 'electric']),
                'transmission' => fake()->randomElement(['manual', 'manual', 'automatic']),
                'emission_class' => fake()->randomElement(['euro5', 'euro6', 'euro6', 'euro6d']),
                'power_hp' => $powerHp,
                'power_kw' => (int) round($powerHp * 0.7457),
                'weight_kg' => fake()->numberBetween(2500, 7500),
            ]);

            $this->createListingImages($listing, fake()->numberBetween(2, 5));
        }
    }

    // =========================================================================
    // Equipment Listings (70)
    // =========================================================================

    private function createEquipmentListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'equipment')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $equipmentBrands = Brand::whereIn('slug', [
            'caterpillar', 'komatsu', 'jcb', 'liebherr',
        ])->with('models')->get();

        $equipmentDescriptions = [
            'Well-maintained machine from a single owner. Full service records available. Low hours for the year. Undercarriage in good condition with plenty of life remaining. Equipped with quick coupler, A/C cab, and rear camera.',
            'This machine has been fully serviced and is ready for immediate deployment. All hydraulic systems tested and certified. New tracks/tyres fitted. Comes with operator manual and certification documents.',
            'Powerful and reliable machine suitable for heavy construction work. Recently overhauled engine with new injectors and turbo. Cab features include air conditioning, heating, and radio. Available for inspection.',
            'Compact and versatile machine ideal for urban construction sites. Low noise and emissions. Equipped with multiple attachments including bucket, breaker, and grapple. Excellent visibility from the cab.',
            'Fleet machine with documented maintenance history. All systems functioning perfectly. Equipped with GPS/machine control ready wiring. ROPS/FOPS certified cab. Delivery available across Europe.',
            'Ex-rental machine in excellent condition. Regularly serviced according to manufacturer schedule. Fully operational with all functions tested. Bucket, forks, and other attachments available separately.',
        ];

        $operatingHoursLabels = ['Operating Hours', 'Machine Hours', 'Engine Hours'];

        for ($i = 0; $i < $count; $i++) {
            $brand = $equipmentBrands->random();
            $model = $brand->models->isNotEmpty() ? $brand->models->random() : null;
            $subCategoryId = fake()->randomElement(array_values($subCategories));
            $year = fake()->numberBetween(2015, 2024);
            $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']);
            $powerHp = fake()->numberBetween(50, 500);
            $operatingHours = $condition === 'new' ? fake()->numberBetween(0, 50) : fake()->numberBetween(1000, 15000);

            $modelName = $model ? $model->name : '';
            $subCatSlug = array_search($subCategoryId, $subCategories);
            $typeName = ucfirst(str_replace('-', ' ', $subCatSlug ?: 'Equipment'));

            $title = "{$brand->name} {$modelName} {$typeName} {$year}";
            if ($condition === 'new') {
                $title = "NEW {$title}";
            }

            $price = fake()->numberBetween(20000, 250000);

            $listing = $this->createListing([
                'category_id' => $subCategoryId,
                'brand_id' => $brand->id,
                'brand_model_id' => $model?->id,
                'title' => trim($title),
                'description' => fake()->randomElement($equipmentDescriptions) .
                    "\n\n" . fake()->randomElement($operatingHoursLabels) . ": {$operatingHours} hrs",
                'price' => $price,
                'condition' => $condition,
                'year' => $year,
                'mileage' => $operatingHours,
                'mileage_unit' => 'hours',
                'fuel_type' => fake()->randomElement(['diesel', 'diesel', 'diesel', 'electric']),
                'transmission' => null,
                'emission_class' => fake()->randomElement(['euro3', 'euro4', 'euro5', 'euro5']),
                'power_hp' => $powerHp,
                'power_kw' => (int) round($powerHp * 0.7457),
                'weight_kg' => fake()->numberBetween(2000, 80000),
            ]);

            $this->createListingImages($listing, fake()->numberBetween(2, 5));
        }
    }

    // =========================================================================
    // Parts Listings (50)
    // =========================================================================

    private function createPartsListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'parts')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $partItems = [
            'engines' => [
                'Mercedes-Benz OM471 Engine 450HP' => [2000, 5000],
                'Volvo D13 Engine 500HP Complete' => [2500, 5000],
                'Scania DC13 Engine 410HP' => [1800, 4500],
                'MAN D2676 Engine 480HP' => [2000, 4800],
                'DAF MX-13 Engine 530HP' => [2200, 5000],
                'Cummins X15 Engine 565HP' => [2500, 5000],
                'Iveco Cursor 13 Engine 460HP' => [1500, 4000],
            ],
            'transmissions' => [
                'ZF TraXon 12-Speed Automated' => [1500, 3500],
                'ZF ASTronic 16-Speed' => [1200, 3000],
                'Volvo I-Shift 12-Speed' => [1800, 3800],
                'Mercedes PowerShift 3 12-Speed' => [1600, 3500],
                'Allison 4500 Automatic' => [2000, 4000],
                'Eaton Fuller 10-Speed Manual' => [800, 2000],
            ],
            'axles' => [
                'BPW ECO Plus Trailer Axle' => [500, 1500],
                'SAF INTRA Disc Brake Axle' => [600, 1800],
                'Mercedes HL7 Rear Axle Complete' => [1000, 3000],
                'Volvo RSS1344C Rear Axle' => [1200, 2800],
                'Dana Spicer S150 Front Axle' => [800, 2200],
            ],
            'tyres-wheels' => [
                'Michelin X Multi 315/80R22.5 Set of 6' => [800, 2000],
                'Continental EcoPlus 385/65R22.5 Set of 4' => [600, 1500],
                'Bridgestone R-Drive 295/80R22.5 Pair' => [300, 800],
                'Goodyear KMAX S 315/70R22.5 New' => [200, 500],
                'Alcoa Aluminium Wheel Set 22.5" x 8' => [400, 1200],
            ],
            'brakes' => [
                'Knorr-Bremse Complete Brake Kit Trailer' => [300, 800],
                'WABCO ABS System Complete' => [400, 1000],
                'Haldex Brake Caliper Set' => [200, 600],
                'Brake Disc Set for Mercedes Actros' => [300, 700],
                'Air Dryer Cartridge Knorr-Bremse' => [50, 150],
            ],
            'body-parts' => [
                'Mercedes Actros MP4 Complete Front Bumper' => [300, 900],
                'Volvo FH4 Headlight Right LED' => [400, 1200],
                'Scania R-series Grille with Chrome' => [200, 600],
                'MAN TGX Side Mirror Right Electric' => [150, 400],
                'DAF XF Front Panel Complete' => [250, 700],
                'Truck Cabin Mercedes Atego Day Cab' => [2000, 5000],
            ],
            'electronics' => [
                'Continental VDO Tachograph DTCO 4.1' => [400, 1000],
                'WABCO TEBS-E Trailer EBS Module' => [300, 800],
                'Hella LED Rear Light Set Trailer' => [100, 300],
                'Webasto Air Heater AT2000' => [200, 500],
                'Eberspächer Hydronic D5 Parking Heater' => [300, 700],
                'GPS Tracking System Fleet Complete Kit' => [150, 400],
            ],
            'hydraulics' => [
                'Hydraulic Pump for Tipper Truck' => [500, 1500],
                'PTO Unit ZF for Mercedes Actros' => [600, 1800],
                'Hydraulic Cylinder Double Acting 80x50x500' => [200, 600],
                'Hyva Tipping Cylinder Front Mount' => [800, 2000],
                'Parker Hydraulic Motor OMP 315' => [300, 900],
            ],
        ];

        $partsDescriptions = [
            'Genuine OEM part in excellent condition. Removed from low-mileage vehicle during fleet renewal. Part number and compatibility information available. Can ship anywhere in Europe within 2-3 business days.',
            'New aftermarket replacement part with full manufacturer warranty. Compatible with multiple makes and models. Same specification as OEM. Complete with fitting hardware and instructions.',
            'Used part in good working order. Fully tested and inspected before listing. Comes with 30-day warranty. High-resolution photos show actual condition. Original part number provided for cross-reference.',
            'Reconditioned part with new seals, bearings, and wear components. Professionally rebuilt to OEM specifications. Carries 6-month warranty. Installation support available via phone.',
            'Surplus stock from dealer — brand new in original packaging. Never fitted or used. Full manufacturer warranty applies. Significant saving compared to retail price.',
        ];

        $listingsCreated = 0;

        while ($listingsCreated < $count) {
            foreach ($partItems as $subCatSlug => $items) {
                if ($listingsCreated >= $count) {
                    break;
                }

                $categoryId = $subCategories[$subCatSlug] ?? null;
                if (! $categoryId) {
                    continue;
                }

                $itemName = fake()->randomElement(array_keys($items));
                $priceRange = $items[$itemName];
                $price = fake()->numberBetween($priceRange[0], $priceRange[1]);
                $condition = fake()->randomElement(['new', 'used', 'used', 'used']);

                $listing = $this->createListing([
                    'category_id' => $categoryId,
                    'brand_id' => null,
                    'brand_model_id' => null,
                    'title' => ($condition === 'new' ? 'NEW ' : 'Used ') . $itemName,
                    'description' => fake()->randomElement($partsDescriptions),
                    'price' => $price,
                    'condition' => $condition,
                    'year' => fake()->numberBetween(2018, 2024),
                    'mileage' => $condition === 'new' ? 0 : fake()->numberBetween(0, 300000),
                    'fuel_type' => null,
                    'transmission' => null,
                    'emission_class' => null,
                    'power_hp' => null,
                    'power_kw' => null,
                    'weight_kg' => fake()->numberBetween(1, 500),
                ]);

                $this->createListingImages($listing, fake()->numberBetween(2, 4));
                $listingsCreated++;
            }
        }
    }

    // =========================================================================
    // Car Listings (50)
    // =========================================================================

    private function createCarListings(int $count): void
    {
        $parentCategory = Category::where('slug', 'cars')->first();
        $subCategories = Category::where('parent_id', $parentCategory->id)->pluck('id', 'slug')->toArray();

        $carBrandModels = [
            'BMW' => ['320d', '520d', 'X3 xDrive20d', 'X5 xDrive30d', '330i'],
            'Audi' => ['A4 2.0 TDI', 'A6 3.0 TDI', 'Q5 2.0 TDI', 'Q7 3.0 TDI', 'A3 Sportback'],
            'Volkswagen' => ['Passat 2.0 TDI', 'Golf 1.5 TSI', 'Tiguan 2.0 TDI', 'Touareg 3.0 V6'],
            'Mercedes-Benz' => ['C 220 d', 'E 300 d', 'GLC 220 d', 'S 350 d', 'A 200'],
            'Toyota' => ['Corolla 1.8 Hybrid', 'RAV4 2.5 Hybrid', 'Camry 2.5', 'Land Cruiser 2.8D'],
            'Peugeot' => ['308 1.5 BlueHDi', '3008 1.6 PureTech', '508 2.0 BlueHDi'],
            'Renault' => ['Megane 1.5 dCi', 'Kadjar 1.3 TCe', 'Talisman 1.8 dCi'],
            'Ford' => ['Focus 1.5 EcoBlue', 'Mondeo 2.0 TDCi', 'Kuga 2.0 EcoBlue', 'Mustang 5.0 V8'],
        ];

        $subCatMapping = [
            'sedans' => ['320d', '520d', 'A4 2.0 TDI', 'A6 3.0 TDI', 'Passat 2.0 TDI', 'C 220 d', 'E 300 d', 'S 350 d', 'Camry 2.5', '508 2.0 BlueHDi', 'Talisman 1.8 dCi', 'Mondeo 2.0 TDCi'],
            'suvs' => ['X3 xDrive20d', 'X5 xDrive30d', 'Q5 2.0 TDI', 'Q7 3.0 TDI', 'Tiguan 2.0 TDI', 'Touareg 3.0 V6', 'GLC 220 d', 'RAV4 2.5 Hybrid', 'Land Cruiser 2.8D', '3008 1.6 PureTech', 'Kadjar 1.3 TCe', 'Kuga 2.0 EcoBlue'],
            'hatchbacks' => ['330i', 'A3 Sportback', 'Golf 1.5 TSI', 'A 200', 'Corolla 1.8 Hybrid', '308 1.5 BlueHDi', 'Megane 1.5 dCi', 'Focus 1.5 EcoBlue'],
            'coupes' => ['Mustang 5.0 V8'],
        ];

        $carDescriptions = [
            'One owner vehicle with full dealer service history. Excellent condition inside and out. Non-smoker car. Equipped with navigation, leather interior, and parking sensors. All keys and documents present.',
            'Low mileage car maintained to the highest standard. Recently serviced with new brake pads and discs. Features include adaptive cruise control, heated seats, and panoramic sunroof.',
            'Well-kept family car with spacious interior. Regular oil changes and inspections. Comes with winter tyres on separate rims. Air conditioning, Bluetooth, and rear camera. Drives perfectly.',
            'Ex-company car in premium specification. Full options including LED headlights, electric tailgate, and digital cockpit display. All services performed on time. Very clean example.',
            'Sporty and economical vehicle with excellent fuel consumption. Fun to drive with responsive handling. Climate control, alloy wheels, and sport seats. Fresh inspection valid for 2 years.',
        ];

        for ($i = 0; $i < $count; $i++) {
            $brandName = fake()->randomElement(array_keys($carBrandModels));
            $modelName = fake()->randomElement($carBrandModels[$brandName]);

            // Determine sub-category based on model
            $subCatSlug = 'sedans'; // default
            foreach ($subCatMapping as $slug => $models) {
                if (in_array($modelName, $models)) {
                    $subCatSlug = $slug;
                    break;
                }
            }
            // Randomly pick wagons/convertibles occasionally
            if (fake()->boolean(10) && isset($subCategories['wagons'])) {
                $subCatSlug = 'wagons';
            }

            $categoryId = $subCategories[$subCatSlug] ?? fake()->randomElement(array_values($subCategories));
            $year = fake()->numberBetween(2016, 2024);
            $condition = fake()->randomElement(['new', 'used', 'used', 'used', 'used']);
            $powerHp = fake()->numberBetween(100, 450);

            $title = "{$brandName} {$modelName} {$year}";
            if ($condition === 'new') {
                $title = "NEW {$title}";
            }

            $price = fake()->numberBetween(5000, 60000);
            $mileage = $condition === 'new' ? fake()->numberBetween(0, 100) : fake()->numberBetween(10000, 250000);

            $listing = $this->createListing([
                'category_id' => $categoryId,
                'brand_id' => null,
                'brand_model_id' => null,
                'title' => $title,
                'description' => fake()->randomElement($carDescriptions),
                'price' => $price,
                'condition' => $condition,
                'year' => $year,
                'mileage' => $mileage,
                'fuel_type' => fake()->randomElement(['diesel', 'diesel', 'petrol', 'petrol', 'hybrid', 'electric']),
                'transmission' => fake()->randomElement(['manual', 'automatic', 'automatic']),
                'emission_class' => fake()->randomElement(['euro5', 'euro6', 'euro6', 'euro6d', 'euro6d']),
                'power_hp' => $powerHp,
                'power_kw' => (int) round($powerHp * 0.7457),
                'weight_kg' => fake()->numberBetween(1200, 2500),
            ]);

            $this->createListingImages($listing, fake()->numberBetween(2, 5));
        }
    }

    // =========================================================================
    // Helper Methods
    // =========================================================================

    /**
     * Create a single listing with common fields plus the provided overrides.
     */
    private function createListing(array $attributes): Listing
    {
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

        $colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Grey', 'Beige'];

        $defaults = [
            'user_id' => fake()->randomElement($this->sellerIds),
            'location_id' => fake()->randomElement($this->locationIds),
            'slug' => Str::slug($attributes['title'] ?? 'listing') . '-' . Str::random(6),
            'currency' => 'EUR',
            'price_negotiable' => fake()->boolean(40),
            'mileage_unit' => 'km',
            'color' => fake()->randomElement($colors),
            'status' => $status,
            'view_count' => fake()->numberBetween(0, 5000),
            'contact_count' => fake()->numberBetween(0, 50),
            'is_featured' => fake()->boolean(10),
            'published_at' => $publishedAt,
            'expires_at' => $publishedAt ? now()->addMonths(3) : null,
        ];

        $data = array_merge($defaults, $attributes);

        return Listing::create($data);
    }

    /**
     * Create placeholder images for a listing.
     */
    private function createListingImages(Listing $listing, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            ListingImage::create([
                'listing_id' => $listing->id,
                'path' => "listings/{$listing->id}/image_{$i}.jpg",
                'url' => "/placeholder/listing_{$listing->id}_{$i}.jpg",
                'thumbnail_url' => "/placeholder/listing_{$listing->id}_{$i}_thumb.jpg",
                'alt_text' => $listing->title . " - Image " . ($i + 1),
                'position' => $i,
                'is_primary' => $i === 0,
                'file_size' => fake()->numberBetween(100000, 2000000),
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1280,
            ]);
        }
    }
}
