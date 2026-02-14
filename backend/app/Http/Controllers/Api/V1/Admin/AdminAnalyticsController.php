<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    /**
     * Overview analytics: total listings, users, views, registrations over time.
     */
    public function overview(): JsonResponse
    {
        $totalListings = Listing::count();
        $activeListings = Listing::where('status', ListingStatus::Active)->count();
        $pendingListings = Listing::where('status', ListingStatus::PendingReview)->count();
        $totalUsers = User::count();
        $totalViews = (int) Listing::sum('view_count');

        // Registrations over the last 30 days
        $registrationsOverTime = User::query()
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'count' => (int) $row->count,
            ]);

        // Listings created over the last 30 days
        $listingsOverTime = Listing::query()
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'count' => (int) $row->count,
            ]);

        return response()->json([
            'data' => [
                'total_listings' => $totalListings,
                'active_listings' => $activeListings,
                'pending_listings' => $pendingListings,
                'total_users' => $totalUsers,
                'total_views' => $totalViews,
                'registrations_over_time' => $registrationsOverTime,
                'listings_over_time' => $listingsOverTime,
            ],
        ]);
    }

    /**
     * Listing analytics: stats by category, status breakdown.
     */
    public function listings(Request $request): JsonResponse
    {
        // Status breakdown
        $statusBreakdown = Listing::query()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status,
                'count' => (int) $row->count,
            ]);

        // Listings by category
        $byCategory = Listing::query()
            ->join('categories', 'listings.category_id', '=', 'categories.id')
            ->select(
                'categories.name as category_name',
                'categories.slug as category_slug',
                DB::raw('COUNT(listings.id) as listing_count'),
                DB::raw('AVG(listings.price) as avg_price'),
            )
            ->groupBy('categories.id', 'categories.name', 'categories.slug')
            ->orderByDesc('listing_count')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category_name,
                'slug' => $row->category_slug,
                'listing_count' => (int) $row->listing_count,
                'avg_price' => $row->avg_price ? round((float) $row->avg_price, 2) : null,
            ]);

        // Top viewed listings
        $topViewed = Listing::query()
            ->where('status', ListingStatus::Active)
            ->orderByDesc('view_count')
            ->limit(10)
            ->get(['id', 'title', 'slug', 'view_count', 'favorite_count'])
            ->map(fn ($listing) => [
                'id' => $listing->id,
                'title' => $listing->title,
                'slug' => $listing->slug,
                'view_count' => $listing->view_count,
                'favorite_count' => $listing->favorite_count,
            ]);

        return response()->json([
            'data' => [
                'status_breakdown' => $statusBreakdown,
                'by_category' => $byCategory,
                'top_viewed' => $topViewed,
            ],
        ]);
    }

    /**
     * User analytics: registration trends, role breakdown.
     */
    public function users(Request $request): JsonResponse
    {
        // Role breakdown
        $roleBreakdown = User::query()
            ->select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->get()
            ->map(fn ($row) => [
                'role' => $row->role,
                'count' => (int) $row->count,
            ]);

        // Registration trends (last 90 days, weekly)
        $registrationTrends = User::query()
            ->where('created_at', '>=', now()->subDays(90))
            ->select(
                DB::raw('YEARWEEK(created_at) as week'),
                DB::raw('MIN(DATE(created_at)) as week_start'),
                DB::raw('COUNT(*) as count'),
            )
            ->groupBy('week')
            ->orderBy('week')
            ->get()
            ->map(fn ($row) => [
                'week_start' => $row->week_start,
                'count' => (int) $row->count,
            ]);

        // Active vs inactive
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        // Sellers with most listings
        $topSellers = User::query()
            ->where('role', 'seller')
            ->withCount('listings')
            ->orderByDesc('listings_count')
            ->limit(10)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'listings_count' => $user->listings_count,
            ]);

        return response()->json([
            'data' => [
                'role_breakdown' => $roleBreakdown,
                'registration_trends' => $registrationTrends,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'top_sellers' => $topSellers,
            ],
        ]);
    }
}
