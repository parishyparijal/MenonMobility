<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Trucks',
                'slug' => 'trucks',
                'description' => 'Commercial trucks of all types including box trucks, tractor units, tippers, and more.',
                'icon' => 'truck',
                'sort_order' => 1,
                'is_active' => true,
                'children' => [
                    ['name' => 'Box Trucks', 'slug' => 'box-trucks', 'icon' => 'truck-box', 'sort_order' => 1],
                    ['name' => 'Tractor Units', 'slug' => 'tractor-units', 'icon' => 'truck-tractor', 'sort_order' => 2],
                    ['name' => 'Tipper Trucks', 'slug' => 'tipper-trucks', 'icon' => 'truck-tipper', 'sort_order' => 3],
                    ['name' => 'Flatbed Trucks', 'slug' => 'flatbed-trucks', 'icon' => 'truck-flatbed', 'sort_order' => 4],
                    ['name' => 'Refrigerated Trucks', 'slug' => 'refrigerated-trucks', 'icon' => 'truck-refrigerated', 'sort_order' => 5],
                    ['name' => 'Crane Trucks', 'slug' => 'crane-trucks', 'icon' => 'truck-crane', 'sort_order' => 6],
                    ['name' => 'Fire Trucks', 'slug' => 'fire-trucks', 'icon' => 'truck-fire', 'sort_order' => 7],
                    ['name' => 'Tank Trucks', 'slug' => 'tank-trucks', 'icon' => 'truck-tank', 'sort_order' => 8],
                    ['name' => 'Garbage Trucks', 'slug' => 'garbage-trucks', 'icon' => 'truck-garbage', 'sort_order' => 9],
                    ['name' => 'Logging Trucks', 'slug' => 'logging-trucks', 'icon' => 'truck-logging', 'sort_order' => 10],
                ],
            ],
            [
                'name' => 'Trailers',
                'slug' => 'trailers',
                'description' => 'All types of trailers including curtainsiders, flatbeds, refrigerated, and specialty trailers.',
                'icon' => 'trailer',
                'sort_order' => 2,
                'is_active' => true,
                'children' => [
                    ['name' => 'Curtainsider', 'slug' => 'curtainsider', 'icon' => 'trailer-curtain', 'sort_order' => 1],
                    ['name' => 'Flatbed Trailers', 'slug' => 'flatbed-trailers', 'icon' => 'trailer-flatbed', 'sort_order' => 2],
                    ['name' => 'Refrigerated Trailers', 'slug' => 'refrigerated-trailers', 'icon' => 'trailer-refrigerated', 'sort_order' => 3],
                    ['name' => 'Tank Trailers', 'slug' => 'tank-trailers', 'icon' => 'trailer-tank', 'sort_order' => 4],
                    ['name' => 'Container Chassis', 'slug' => 'container-chassis', 'icon' => 'trailer-container', 'sort_order' => 5],
                    ['name' => 'Tipper Trailers', 'slug' => 'tipper-trailers', 'icon' => 'trailer-tipper', 'sort_order' => 6],
                    ['name' => 'Lowboy Trailers', 'slug' => 'lowboy-trailers', 'icon' => 'trailer-lowboy', 'sort_order' => 7],
                    ['name' => 'Walking Floor', 'slug' => 'walking-floor', 'icon' => 'trailer-walking-floor', 'sort_order' => 8],
                ],
            ],
            [
                'name' => 'Vans & LCVs',
                'slug' => 'vans',
                'description' => 'Light commercial vehicles, panel vans, pickup trucks, and minibuses.',
                'icon' => 'van',
                'sort_order' => 3,
                'is_active' => true,
                'children' => [
                    ['name' => 'Panel Vans', 'slug' => 'panel-vans', 'icon' => 'van-panel', 'sort_order' => 1],
                    ['name' => 'Pickup Trucks', 'slug' => 'pickup-trucks', 'icon' => 'van-pickup', 'sort_order' => 2],
                    ['name' => 'Box Vans', 'slug' => 'box-vans', 'icon' => 'van-box', 'sort_order' => 3],
                    ['name' => 'Refrigerated Vans', 'slug' => 'refrigerated-vans', 'icon' => 'van-refrigerated', 'sort_order' => 4],
                    ['name' => 'Minibuses', 'slug' => 'minibuses', 'icon' => 'van-minibus', 'sort_order' => 5],
                    ['name' => 'Chassis Cabs', 'slug' => 'chassis-cabs', 'icon' => 'van-chassis', 'sort_order' => 6],
                ],
            ],
            [
                'name' => 'Construction Equipment',
                'slug' => 'equipment',
                'description' => 'Heavy construction equipment including excavators, loaders, bulldozers, and cranes.',
                'icon' => 'excavator',
                'sort_order' => 4,
                'is_active' => true,
                'children' => [
                    ['name' => 'Excavators', 'slug' => 'excavators', 'icon' => 'equipment-excavator', 'sort_order' => 1],
                    ['name' => 'Wheel Loaders', 'slug' => 'wheel-loaders', 'icon' => 'equipment-loader', 'sort_order' => 2],
                    ['name' => 'Bulldozers', 'slug' => 'bulldozers', 'icon' => 'equipment-bulldozer', 'sort_order' => 3],
                    ['name' => 'Cranes', 'slug' => 'cranes', 'icon' => 'equipment-crane', 'sort_order' => 4],
                    ['name' => 'Forklifts', 'slug' => 'forklifts', 'icon' => 'equipment-forklift', 'sort_order' => 5],
                    ['name' => 'Compactors', 'slug' => 'compactors', 'icon' => 'equipment-compactor', 'sort_order' => 6],
                    ['name' => 'Concrete Mixers', 'slug' => 'concrete-mixers', 'icon' => 'equipment-mixer', 'sort_order' => 7],
                    ['name' => 'Generators', 'slug' => 'generators', 'icon' => 'equipment-generator', 'sort_order' => 8],
                ],
            ],
            [
                'name' => 'Parts & Components',
                'slug' => 'parts',
                'description' => 'Spare parts and components for trucks, trailers, and commercial vehicles.',
                'icon' => 'cog',
                'sort_order' => 5,
                'is_active' => true,
                'children' => [
                    ['name' => 'Engines', 'slug' => 'engines', 'icon' => 'parts-engine', 'sort_order' => 1],
                    ['name' => 'Transmissions', 'slug' => 'transmissions', 'icon' => 'parts-transmission', 'sort_order' => 2],
                    ['name' => 'Axles', 'slug' => 'axles', 'icon' => 'parts-axle', 'sort_order' => 3],
                    ['name' => 'Tyres & Wheels', 'slug' => 'tyres-wheels', 'icon' => 'parts-tyre', 'sort_order' => 4],
                    ['name' => 'Brakes', 'slug' => 'brakes', 'icon' => 'parts-brake', 'sort_order' => 5],
                    ['name' => 'Body Parts', 'slug' => 'body-parts', 'icon' => 'parts-body', 'sort_order' => 6],
                    ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'parts-electronics', 'sort_order' => 7],
                    ['name' => 'Hydraulics', 'slug' => 'hydraulics', 'icon' => 'parts-hydraulics', 'sort_order' => 8],
                ],
            ],
            [
                'name' => 'Cars',
                'slug' => 'cars',
                'description' => 'Passenger cars including sedans, SUVs, hatchbacks, and more.',
                'icon' => 'car',
                'sort_order' => 6,
                'is_active' => true,
                'children' => [
                    ['name' => 'Sedans', 'slug' => 'sedans', 'icon' => 'car-sedan', 'sort_order' => 1],
                    ['name' => 'SUVs', 'slug' => 'suvs', 'icon' => 'car-suv', 'sort_order' => 2],
                    ['name' => 'Hatchbacks', 'slug' => 'hatchbacks', 'icon' => 'car-hatchback', 'sort_order' => 3],
                    ['name' => 'Wagons', 'slug' => 'wagons', 'icon' => 'car-wagon', 'sort_order' => 4],
                    ['name' => 'Coupes', 'slug' => 'coupes', 'icon' => 'car-coupe', 'sort_order' => 5],
                    ['name' => 'Convertibles', 'slug' => 'convertibles', 'icon' => 'car-convertible', 'sort_order' => 6],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $parent = Category::create($categoryData);

            foreach ($children as $childData) {
                Category::create(array_merge($childData, [
                    'parent_id' => $parent->id,
                    'description' => $childData['name'] . ' available for sale.',
                    'is_active' => true,
                ]));
            }
        }
    }
}
