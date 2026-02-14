<?php

declare(strict_types=1);

namespace App\Enums;

enum TransmissionType: string
{
    case Manual = 'manual';
    case Automatic = 'automatic';
    case SemiAutomatic = 'semi_automatic';

    public function label(): string
    {
        return match ($this) {
            self::Manual => 'Manual',
            self::Automatic => 'Automatic',
            self::SemiAutomatic => 'Semi-Automatic',
        };
    }
}
