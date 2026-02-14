<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Buyer = 'buyer';
    case Seller = 'seller';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Buyer => 'Buyer',
            self::Seller => 'Seller',
            self::Admin => 'Administrator',
        };
    }

    public function isPrivileged(): bool
    {
        return in_array($this, [self::Seller, self::Admin]);
    }
}
