<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Http\Resources\MessageThreadResource;
use App\Models\Listing;
use App\Models\MessageThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * List the authenticated user's message threads.
     */
    public function threads(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $threads = MessageThread::query()
            ->where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->with([
                'listing.images',
                'buyer',
                'seller',
                'latestMessage',
            ])
            ->withCount([
                'messages as unread_count' => fn ($q) => $q
                    ->where('sender_id', '!=', $user->id)
                    ->where('is_read', false),
            ])
            ->orderByDesc('last_message_at')
            ->paginate(20);

        return MessageThreadResource::collection($threads);
    }

    /**
     * Show messages in a specific thread.
     */
    public function show(Request $request, MessageThread $thread): JsonResponse
    {
        $user = $request->user();

        // Ensure user is a participant
        if ($thread->buyer_id !== $user->id && $thread->seller_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $messages = $thread->messages()
            ->with('sender:id,name,avatar')
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json([
            'thread' => new MessageThreadResource($thread->load(['listing.images', 'buyer', 'seller'])),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    /**
     * Send a message (create thread if needed).
     */
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $listing = Listing::with('user')->findOrFail($validated['listing_id']);

        // Cannot message your own listing
        if ($listing->user_id === $user->id) {
            return response()->json([
                'message' => 'You cannot send a message on your own listing.',
            ], 422);
        }

        $thread = DB::transaction(function () use ($user, $listing, $validated): MessageThread {
            // Find or create thread
            $thread = MessageThread::firstOrCreate(
                [
                    'listing_id' => $listing->id,
                    'buyer_id' => $user->id,
                ],
                [
                    'seller_id' => $listing->user_id,
                    'last_message_at' => now(),
                ],
            );

            // Create the message
            $thread->messages()->create([
                'sender_id' => $user->id,
                'body' => $validated['body'],
            ]);

            $thread->update(['last_message_at' => now()]);

            return $thread;
        });

        $thread->load(['listing.images', 'buyer', 'seller', 'latestMessage']);

        return response()->json([
            'message' => 'Message sent.',
            'data' => new MessageThreadResource($thread),
        ], 201);
    }

    /**
     * Mark all messages in a thread as read.
     */
    public function markRead(Request $request, MessageThread $thread): JsonResponse
    {
        $user = $request->user();

        // Ensure user is a participant
        if ($thread->buyer_id !== $user->id && $thread->seller_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $thread->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'Messages marked as read.',
        ]);
    }
}
