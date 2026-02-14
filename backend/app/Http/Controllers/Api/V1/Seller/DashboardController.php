<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Seller;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\MessageThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Return seller dashboard statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user->id;

        // Listing stats
        $totalListings = Listing::where('user_id', $userId)->count();
        $activeListings = Listing::where('user_id', $userId)->where('status', ListingStatus::Active)->count();

        // Aggregate counters
        $totalViews = (int) Listing::where('user_id', $userId)->sum('view_count');
        $totalFavorites = (int) Listing::where('user_id', $userId)->sum('favorite_count');

        // Message stats
        $totalMessages = MessageThread::where('seller_id', $userId)
            ->withCount([
                'messages as unread_count' => fn ($q) => $q
                    ->where('sender_id', '!=', $userId)
                    ->where('is_read', false),
            ])
            ->get()
            ->sum('unread_count');

        $totalThreads = MessageThread::where('seller_id', $userId)->count();

        // Recent activity: latest 10 listings
        $recentActivity = Listing::where('user_id', $userId)
            ->with('images')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Listing $listing) => [
                'id' => $listing->id,
                'title' => $listing->title,
                'slug' => $listing->slug,
                'status' => $listing->status,
                'view_count' => $listing->view_count,
                'favorite_count' => $listing->favorite_count,
                'created_at' => $listing->created_at->toIso8601String(),
            ]);

        return response()->json([
            'data' => [
                'total_listings' => $totalListings,
                'active_listings' => $activeListings,
                'total_views' => $totalViews,
                'total_favorites' => $totalFavorites,
                'total_messages' => $totalThreads,
                'unread_messages' => $totalMessages,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
