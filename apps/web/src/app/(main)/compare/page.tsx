'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, BarChart3, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CompareVehicle {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string;
  condition: string;
  image: string;
  specs: Record<string, string>;
}

const dummyVehicles: CompareVehicle[] = [
  {
    id: '1',
    slug: 'mercedes-actros-2545-ls-2022',
    title: 'Mercedes-Benz Actros 2545 LS 6x2',
    price: 89500,
    currency: 'USD',
    condition: 'Used',
    image: '',
    specs: {
      Brand: 'Mercedes-Benz',
      Model: 'Actros 2545 LS',
      Year: '2022',
      Mileage: '185,000 km',
      'Fuel Type': 'Diesel',
      Power: '330 kW (449 HP)',
      Transmission: 'Automatic',
      'Emission Class': 'Euro 6',
      'Axle Configuration': '6x2',
      GVW: '25,000 kg',
      'Cab Type': 'StreamSpace',
      Color: 'White',
      Country: 'Netherlands',
      'Air Conditioning': 'Yes',
      'Cruise Control': 'Yes',
      'Parking Sensors': 'Yes',
    },
  },
  {
    id: '2',
    slug: 'volvo-fh-500-2023',
    title: 'Volvo FH 500 4x2 Globetrotter XL',
    price: 125000,
    currency: 'USD',
    condition: 'Used',
    image: '',
    specs: {
      Brand: 'Volvo',
      Model: 'FH 500',
      Year: '2023',
      Mileage: '95,000 km',
      'Fuel Type': 'Diesel',
      Power: '368 kW (500 HP)',
      Transmission: 'Automatic',
      'Emission Class': 'Euro 6',
      'Axle Configuration': '4x2',
      GVW: '18,000 kg',
      'Cab Type': 'Globetrotter XL',
      Color: 'Silver',
      Country: 'Germany',
      'Air Conditioning': 'Yes',
      'Cruise Control': 'Yes',
      'Parking Sensors': 'No',
    },
  },
  {
    id: '3',
    slug: 'scania-r450-2021',
    title: 'Scania R 450 A4x2NA Highline',
    price: 78900,
    currency: 'USD',
    condition: 'Used',
    image: '',
    specs: {
      Brand: 'Scania',
      Model: 'R 450',
      Year: '2021',
      Mileage: '310,000 km',
      'Fuel Type': 'Diesel',
      Power: '331 kW (450 HP)',
      Transmission: 'Automatic',
      'Emission Class': 'Euro 6',
      'Axle Configuration': '4x2',
      GVW: '18,000 kg',
      'Cab Type': 'Highline',
      Color: 'Blue',
      Country: 'Belgium',
      'Air Conditioning': 'Yes',
      'Cruise Control': 'Yes',
      'Parking Sensors': 'Yes',
    },
  },
];

const allSpecKeys = [
  'Brand', 'Model', 'Year', 'Mileage', 'Fuel Type', 'Power', 'Transmission',
  'Emission Class', 'Axle Configuration', 'GVW', 'Cab Type', 'Color', 'Country',
  'Air Conditioning', 'Cruise Control', 'Parking Sensors',
];

export default function ComparePage() {
  const [selectedVehicles, setSelectedVehicles] = useState<CompareVehicle[]>(
    dummyVehicles.slice(0, 3)
  );
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const maxSlots = 4;
  const emptySlots = maxSlots - selectedVehicles.length;

  const removeVehicle = (id: string) => {
    setSelectedVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const isDifferent = (key: string) => {
    if (selectedVehicles.length < 2) return false;
    const values = selectedVehicles.map((v) => v.specs[key] || '-');
    return new Set(values).size > 1;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Compare Vehicles
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare up to {maxSlots} vehicles side by side
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded border-border accent-accent"
            />
            <span className="text-foreground">Highlight differences</span>
          </label>
        </div>

        {/* Vehicle Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {selectedVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="relative">
              <button
                onClick={() => removeVehicle(vehicle.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <CardContent className="pt-6">
                <div className="aspect-[4/3] bg-muted rounded-lg mb-3 flex items-center justify-center text-muted-foreground text-sm">
                  Image
                </div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">
                  <Link href={`/listings/${vehicle.slug}`} className="hover:text-primary transition-colors">
                    {vehicle.title}
                  </Link>
                </h3>
                <p className="text-lg font-bold text-accent">
                  {vehicle.price
                    ? new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: vehicle.currency,
                        maximumFractionDigits: 0,
                      }).format(vehicle.price)
                    : 'Price on request'}
                </p>
                <Badge variant="secondary" className="mt-2">{vehicle.condition}</Badge>
              </CardContent>
            </Card>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <Card key={`empty-${i}`} className="border-dashed">
              <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[280px]">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">Add a vehicle</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/search">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Spec Comparison Table */}
        {selectedVehicles.length >= 2 && (
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground w-44 sticky left-0 bg-white">
                      Specification
                    </th>
                    {selectedVehicles.map((v) => (
                      <th key={v.id} className="text-left py-3 px-4 text-sm font-semibold text-foreground min-w-[180px]">
                        {v.specs.Brand} {v.specs.Model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSpecKeys.map((key) => {
                    const diff = isDifferent(key);
                    return (
                      <tr
                        key={key}
                        className={cn(
                          'border-t border-border',
                          highlightDifferences && diff && 'bg-accent/5'
                        )}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground sticky left-0 bg-inherit font-medium">
                          {key}
                        </td>
                        {selectedVehicles.map((v) => {
                          const val = v.specs[key] || '-';
                          const isYes = val === 'Yes';
                          const isNo = val === 'No';
                          return (
                            <td
                              key={v.id}
                              className={cn(
                                'py-3 px-4 text-sm text-foreground',
                                highlightDifferences && diff && 'font-medium'
                              )}
                            >
                              {isYes ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : isNo ? (
                                <Minus className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                val
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {selectedVehicles.length < 2 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Add vehicles to compare</h3>
            <p className="text-muted-foreground mb-4">Select at least 2 vehicles to see a side-by-side comparison</p>
            <Button variant="accent" asChild>
              <Link href="/search">Browse Listings</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
