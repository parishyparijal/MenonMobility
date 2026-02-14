<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\MessageThread;
use App\Models\User;

class MessagePolicy
{
    /**
     * A user may view a message thread only if they are the buyer or the seller.
     */
    public function view(User $user, MessageThread $thread): bool
    {
        return $thread->buyer_id === $user->id
            || $thread->seller_id === $user->id;
    }

    /**
     * Any authenticated user may create (send) a message.
     */
    public function create(User $user): bool
    {
        return true;
    }
}
