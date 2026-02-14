<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // Netherlands (NL)
            ['name' => 'Amsterdam, Netherlands', 'city' => 'Amsterdam', 'state' => 'North Holland', 'country' => 'NL', 'latitude' => 52.37403000, 'longitude' => 4.88969000],
            ['name' => 'Rotterdam, Netherlands', 'city' => 'Rotterdam', 'state' => 'South Holland', 'country' => 'NL', 'latitude' => 51.92442000, 'longitude' => 4.47773000],
            ['name' => 'The Hague, Netherlands', 'city' => 'The Hague', 'state' => 'South Holland', 'country' => 'NL', 'latitude' => 52.07667000, 'longitude' => 4.29861000],
            ['name' => 'Utrecht, Netherlands', 'city' => 'Utrecht', 'state' => 'Utrecht', 'country' => 'NL', 'latitude' => 52.09083000, 'longitude' => 5.12222000],
            ['name' => 'Eindhoven, Netherlands', 'city' => 'Eindhoven', 'state' => 'North Brabant', 'country' => 'NL', 'latitude' => 51.44164000, 'longitude' => 5.46972000],

            // Germany (DE)
            ['name' => 'Berlin, Germany', 'city' => 'Berlin', 'state' => 'Berlin', 'country' => 'DE', 'latitude' => 52.52001000, 'longitude' => 13.40495000],
            ['name' => 'Munich, Germany', 'city' => 'Munich', 'state' => 'Bavaria', 'country' => 'DE', 'latitude' => 48.13513000, 'longitude' => 11.58198000],
            ['name' => 'Hamburg, Germany', 'city' => 'Hamburg', 'state' => 'Hamburg', 'country' => 'DE', 'latitude' => 53.55109000, 'longitude' => 9.99368000],
            ['name' => 'Frankfurt, Germany', 'city' => 'Frankfurt', 'state' => 'Hesse', 'country' => 'DE', 'latitude' => 50.11092000, 'longitude' => 8.68213000],
            ['name' => 'Cologne, Germany', 'city' => 'Cologne', 'state' => 'North Rhine-Westphalia', 'country' => 'DE', 'latitude' => 50.93753000, 'longitude' => 6.96028000],
            ['name' => 'Stuttgart, Germany', 'city' => 'Stuttgart', 'state' => 'Baden-Württemberg', 'country' => 'DE', 'latitude' => 48.77585000, 'longitude' => 9.18293000],
            ['name' => 'Düsseldorf, Germany', 'city' => 'Düsseldorf', 'state' => 'North Rhine-Westphalia', 'country' => 'DE', 'latitude' => 51.22774000, 'longitude' => 6.77346000],

            // Belgium (BE)
            ['name' => 'Brussels, Belgium', 'city' => 'Brussels', 'state' => 'Brussels-Capital', 'country' => 'BE', 'latitude' => 50.85034000, 'longitude' => 4.35171000],
            ['name' => 'Antwerp, Belgium', 'city' => 'Antwerp', 'state' => 'Antwerp', 'country' => 'BE', 'latitude' => 51.21989000, 'longitude' => 4.40346000],
            ['name' => 'Ghent, Belgium', 'city' => 'Ghent', 'state' => 'East Flanders', 'country' => 'BE', 'latitude' => 51.05434000, 'longitude' => 3.72174000],
            ['name' => 'Bruges, Belgium', 'city' => 'Bruges', 'state' => 'West Flanders', 'country' => 'BE', 'latitude' => 51.20892000, 'longitude' => 3.22424000],

            // France (FR)
            ['name' => 'Paris, France', 'city' => 'Paris', 'state' => 'Île-de-France', 'country' => 'FR', 'latitude' => 48.85661000, 'longitude' => 2.35222000],
            ['name' => 'Lyon, France', 'city' => 'Lyon', 'state' => 'Auvergne-Rhône-Alpes', 'country' => 'FR', 'latitude' => 45.76404000, 'longitude' => 4.83566000],
            ['name' => 'Marseille, France', 'city' => 'Marseille', 'state' => 'Provence-Alpes-Côte d\'Azur', 'country' => 'FR', 'latitude' => 43.29650000, 'longitude' => 5.36978000],
            ['name' => 'Toulouse, France', 'city' => 'Toulouse', 'state' => 'Occitanie', 'country' => 'FR', 'latitude' => 43.60465000, 'longitude' => 1.44421000],
            ['name' => 'Bordeaux, France', 'city' => 'Bordeaux', 'state' => 'Nouvelle-Aquitaine', 'country' => 'FR', 'latitude' => 44.83780000, 'longitude' => -0.57918000],

            // United Kingdom (GB)
            ['name' => 'London, United Kingdom', 'city' => 'London', 'state' => 'England', 'country' => 'GB', 'latitude' => 51.50735000, 'longitude' => -0.12776000],
            ['name' => 'Manchester, United Kingdom', 'city' => 'Manchester', 'state' => 'England', 'country' => 'GB', 'latitude' => 53.48076000, 'longitude' => -2.24263000],
            ['name' => 'Birmingham, United Kingdom', 'city' => 'Birmingham', 'state' => 'England', 'country' => 'GB', 'latitude' => 52.48624000, 'longitude' => -1.89049000],
            ['name' => 'Leeds, United Kingdom', 'city' => 'Leeds', 'state' => 'England', 'country' => 'GB', 'latitude' => 53.80076000, 'longitude' => -1.54909000],
            ['name' => 'Glasgow, United Kingdom', 'city' => 'Glasgow', 'state' => 'Scotland', 'country' => 'GB', 'latitude' => 55.86424000, 'longitude' => -4.25181000],

            // Spain (ES)
            ['name' => 'Madrid, Spain', 'city' => 'Madrid', 'state' => 'Community of Madrid', 'country' => 'ES', 'latitude' => 40.41678000, 'longitude' => -3.70379000],
            ['name' => 'Barcelona, Spain', 'city' => 'Barcelona', 'state' => 'Catalonia', 'country' => 'ES', 'latitude' => 41.38506000, 'longitude' => 2.17340000],
            ['name' => 'Valencia, Spain', 'city' => 'Valencia', 'state' => 'Valencian Community', 'country' => 'ES', 'latitude' => 39.46975000, 'longitude' => -0.37739000],
            ['name' => 'Seville, Spain', 'city' => 'Seville', 'state' => 'Andalusia', 'country' => 'ES', 'latitude' => 37.38928000, 'longitude' => -5.98460000],

            // Italy (IT)
            ['name' => 'Rome, Italy', 'city' => 'Rome', 'state' => 'Lazio', 'country' => 'IT', 'latitude' => 41.90278000, 'longitude' => 12.49637000],
            ['name' => 'Milan, Italy', 'city' => 'Milan', 'state' => 'Lombardy', 'country' => 'IT', 'latitude' => 45.46427000, 'longitude' => 9.18951000],
            ['name' => 'Naples, Italy', 'city' => 'Naples', 'state' => 'Campania', 'country' => 'IT', 'latitude' => 40.85180000, 'longitude' => 14.26812000],
            ['name' => 'Turin, Italy', 'city' => 'Turin', 'state' => 'Piedmont', 'country' => 'IT', 'latitude' => 45.07049000, 'longitude' => 7.68682000],

            // Poland (PL)
            ['name' => 'Warsaw, Poland', 'city' => 'Warsaw', 'state' => 'Masovia', 'country' => 'PL', 'latitude' => 52.22977000, 'longitude' => 21.01178000],
            ['name' => 'Krakow, Poland', 'city' => 'Krakow', 'state' => 'Lesser Poland', 'country' => 'PL', 'latitude' => 50.06465000, 'longitude' => 19.94498000],
            ['name' => 'Gdansk, Poland', 'city' => 'Gdansk', 'state' => 'Pomerania', 'country' => 'PL', 'latitude' => 54.35203000, 'longitude' => 18.64637000],
            ['name' => 'Wroclaw, Poland', 'city' => 'Wroclaw', 'state' => 'Lower Silesia', 'country' => 'PL', 'latitude' => 51.10789000, 'longitude' => 17.03854000],
        ];

        foreach ($locations as $location) {
            Location::create(array_merge($location, [
                'is_active' => true,
            ]));
        }
    }
}
