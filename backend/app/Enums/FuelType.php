<?php

declare(strict_types=1);

namespace App\Enums;

enum FuelType: string
{
    case Diesel = 'diesel';
    case Petrol = 'petrol';
    case Electric = 'electric';
    case Hybrid = 'hybrid';
    case Lpg = 'lpg';
    case Cng = 'cng';
    case Hydrogen = 'hydrogen';

    public function label(): string
    {
        return match ($this) {
            self::Diesel => 'Diesel',
            self::Petrol => 'Petrol',
            self::Electric => 'Electric',
            self::Hybrid => 'Hybrid',
            self::Lpg => 'LPG',
            self::Cng => 'CNG',
            self::Hydrogen => 'Hydrogen',
        };
    }
}
