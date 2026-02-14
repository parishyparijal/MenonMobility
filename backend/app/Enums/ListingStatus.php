<?php

declare(strict_types=1);

namespace App\Enums;

enum ListingStatus: string
{
    case Draft = 'draft';
    case PendingReview = 'pending_review';
    case Active = 'active';
    case Sold = 'sold';
    case Expired = 'expired';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::PendingReview => 'Pending Review',
            self::Active => 'Active',
            self::Sold => 'Sold',
            self::Expired => 'Expired',
            self::Rejected => 'Rejected',
        };
    }

    public function isVisible(): bool
    {
        return $this === self::Active;
    }

    public function isEditable(): bool
    {
        return in_array($this, [self::Draft, self::Rejected]);
    }

    /**
     * @return array<self>
     */
    public static function publicStatuses(): array
    {
        return [self::Active, self::Sold];
    }
}
