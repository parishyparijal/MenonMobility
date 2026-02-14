<?php

declare(strict_types=1);

namespace App\Enums;

enum VehicleCondition: string
{
    case New = 'new';
    case Used = 'used';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Used => 'Used',
        };
    }
}
