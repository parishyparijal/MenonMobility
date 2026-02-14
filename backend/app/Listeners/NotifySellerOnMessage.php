<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\MessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NotifySellerOnMessage implements ShouldQueue
{
    /**
     * Handle the MessageSent event by sending a notification to the seller.
     */
    public function handle(MessageSent $event): void
    {
        $message = $event->message;
        $thread = $message->thread;

        // Only notify the seller when the buyer sends a message
        if ($message->sender_id === $thread->seller_id) {
            return;
        }

        $seller = $thread->seller;

        $seller->notify(
            new \App\Notifications\NewMessageNotification($message, $thread)
        );
    }
}
