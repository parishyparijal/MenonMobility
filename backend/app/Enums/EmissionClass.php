<?php

declare(strict_types=1);

namespace App\Enums;

enum EmissionClass: string
{
    case Euro1 = 'euro1';
    case Euro2 = 'euro2';
    case Euro3 = 'euro3';
    case Euro4 = 'euro4';
    case Euro5 = 'euro5';
    case Euro6 = 'euro6';
    case Euro6d = 'euro6d';

    public function label(): string
    {
        return match ($this) {
            self::Euro1 => 'Euro 1',
            self::Euro2 => 'Euro 2',
            self::Euro3 => 'Euro 3',
            self::Euro4 => 'Euro 4',
            self::Euro5 => 'Euro 5',
            self::Euro6 => 'Euro 6',
            self::Euro6d => 'Euro 6d',
        };
    }
}
