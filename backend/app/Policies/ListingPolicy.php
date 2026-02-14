<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    /**
     * Anyone can browse listings.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * A listing is viewable if it is active/sold (public), or if the user is the
     * owner or an administrator.
     */
    public function view(?User $user, Listing $listing): bool
    {
        // Public statuses are visible to everyone
        if (in_array($listing->status, ListingStatus::publicStatuses(), true)) {
            return true;
        }

        // Guests cannot see non-public listings
        if ($user === null) {
            return false;
        }

        return $listing->isOwnedBy($user) || $user->isAdmin();
    }

    /**
     * Only sellers and admins may create listings.
     */
    public function create(User $user): bool
    {
        return $user->isSeller() || $user->isAdmin();
    }

    /**
     * Only the owner or an admin may update a listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $listing->isOwnedBy($user) || $user->isAdmin();
    }

    /**
     * Only the owner or an admin may delete a listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $listing->isOwnedBy($user) || $user->isAdmin();
    }
}
