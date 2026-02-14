<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\BrandModel;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -----------------------------------------------------------------
        // Truck / Trailer / Van brands
        // -----------------------------------------------------------------
        $truckBrands = [
            [
                'name' => 'Mercedes-Benz',
                'slug' => 'mercedes-benz',
                'logo' => '/brands/mercedes-benz.png',
                'website' => 'https://www.mercedes-benz-trucks.com',
                'country' => 'Germany',
                'is_active' => true,
                'sort_order' => 1,
                'models' => ['Actros', 'Arocs', 'Atego', 'Antos', 'Econic', 'Unimog', 'Sprinter'],
            ],
            [
                'name' => 'Volvo',
                'slug' => 'volvo',
                'logo' => '/brands/volvo.png',
                'website' => 'https://www.volvotrucks.com',
                'country' => 'Sweden',
                'is_active' => true,
                'sort_order' => 2,
                'models' => ['FH', 'FM', 'FMX', 'FE', 'FL', 'VNL', 'VNR'],
            ],
            [
                'name' => 'Scania',
                'slug' => 'scania',
                'logo' => '/brands/scania.png',
                'website' => 'https://www.scania.com',
                'country' => 'Sweden',
                'is_active' => true,
                'sort_order' => 3,
                'models' => ['R-series', 'S-series', 'G-series', 'P-series', 'L-series'],
            ],
            [
                'name' => 'MAN',
                'slug' => 'man',
                'logo' => '/brands/man.png',
                'website' => 'https://www.man.eu',
                'country' => 'Germany',
                'is_active' => true,
                'sort_order' => 4,
                'models' => ['TGX', 'TGS', 'TGM', 'TGL', 'TGE'],
            ],
            [
                'name' => 'DAF',
                'slug' => 'daf',
                'logo' => '/brands/daf.png',
                'website' => 'https://www.daf.com',
                'country' => 'Netherlands',
                'is_active' => true,
                'sort_order' => 5,
                'models' => ['XG+', 'XG', 'XF', 'CF', 'LF'],
            ],
            [
                'name' => 'Iveco',
                'slug' => 'iveco',
                'logo' => '/brands/iveco.png',
                'website' => 'https://www.iveco.com',
                'country' => 'Italy',
                'is_active' => true,
                'sort_order' => 6,
                'models' => ['S-Way', 'X-Way', 'Eurocargo', 'Daily'],
            ],
            [
                'name' => 'Renault',
                'slug' => 'renault',
                'logo' => '/brands/renault.png',
                'website' => 'https://www.renault-trucks.com',
                'country' => 'France',
                'is_active' => true,
                'sort_order' => 7,
                'models' => ['T-series', 'C-series', 'D-series', 'D Wide', 'Master'],
            ],
            [
                'name' => 'Kenworth',
                'slug' => 'kenworth',
                'logo' => '/brands/kenworth.png',
                'website' => 'https://www.kenworth.com',
                'country' => 'United States',
                'is_active' => true,
                'sort_order' => 8,
                'models' => ['T680', 'W990', 'T880', 'T800'],
            ],
            [
                'name' => 'Peterbilt',
                'slug' => 'peterbilt',
                'logo' => '/brands/peterbilt.png',
                'website' => 'https://www.peterbilt.com',
                'country' => 'United States',
                'is_active' => true,
                'sort_order' => 9,
                'models' => ['579', '389', '567', '520'],
            ],
            [
                'name' => 'PACCAR',
                'slug' => 'paccar',
                'logo' => '/brands/paccar.png',
                'website' => 'https://www.paccar.com',
                'country' => 'United States',
                'is_active' => true,
                'sort_order' => 10,
                'models' => [],
            ],
        ];

        // -----------------------------------------------------------------
        // Construction equipment brands
        // -----------------------------------------------------------------
        $equipmentBrands = [
            [
                'name' => 'Caterpillar',
                'slug' => 'caterpillar',
                'logo' => '/brands/caterpillar.png',
                'website' => 'https://www.caterpillar.com',
                'country' => 'United States',
                'is_active' => true,
                'sort_order' => 11,
                'models' => ['320', '330', '336', '950', '966', 'D6', 'D8'],
            ],
            [
                'name' => 'Komatsu',
                'slug' => 'komatsu',
                'logo' => '/brands/komatsu.png',
                'website' => 'https://www.komatsu.com',
                'country' => 'Japan',
                'is_active' => true,
                'sort_order' => 12,
                'models' => ['PC200', 'PC300', 'WA470', 'D65'],
            ],
            [
                'name' => 'JCB',
                'slug' => 'jcb',
                'logo' => '/brands/jcb.png',
                'website' => 'https://www.jcb.com',
                'country' => 'United Kingdom',
                'is_active' => true,
                'sort_order' => 13,
                'models' => ['3CX', '4CX', 'JS220', '535-95'],
            ],
            [
                'name' => 'Liebherr',
                'slug' => 'liebherr',
                'logo' => '/brands/liebherr.png',
                'website' => 'https://www.liebherr.com',
                'country' => 'Switzerland',
                'is_active' => true,
                'sort_order' => 14,
                'models' => ['R920', 'R926', 'LTM 1300'],
            ],
        ];

        // Fetch parent category IDs for pivot attachment
        $truckCategory = Category::where('slug', 'trucks')->first();
        $trailerCategory = Category::where('slug', 'trailers')->first();
        $vanCategory = Category::where('slug', 'vans')->first();
        $equipmentCategory = Category::where('slug', 'equipment')->first();
        $partsCategory = Category::where('slug', 'parts')->first();
        $carsCategory = Category::where('slug', 'cars')->first();

        // Categories for truck/trailer/van brands (they apply to trucks, trailers, vans, parts, and cars)
        $truckCategoryIds = collect([
            $truckCategory,
            $trailerCategory,
            $vanCategory,
            $partsCategory,
            $carsCategory,
        ])->filter()->pluck('id')->toArray();

        // Categories for equipment brands
        $equipmentCategoryIds = collect([
            $equipmentCategory,
            $partsCategory,
        ])->filter()->pluck('id')->toArray();

        // Create truck/trailer/van brands
        foreach ($truckBrands as $brandData) {
            $models = $brandData['models'];
            unset($brandData['models']);

            $brand = Brand::create($brandData);

            // Attach to relevant categories
            $brand->categories()->attach($truckCategoryIds);

            // Create brand models
            foreach ($models as $modelName) {
                BrandModel::create([
                    'brand_id' => $brand->id,
                    'name' => $modelName,
                    'is_active' => true,
                ]);
            }
        }

        // Create equipment brands
        foreach ($equipmentBrands as $brandData) {
            $models = $brandData['models'];
            unset($brandData['models']);

            $brand = Brand::create($brandData);

            // Attach to relevant categories
            $brand->categories()->attach($equipmentCategoryIds);

            // Create brand models
            foreach ($models as $modelName) {
                BrandModel::create([
                    'brand_id' => $brand->id,
                    'name' => $modelName,
                    'is_active' => true,
                ]);
            }
        }
    }
}
