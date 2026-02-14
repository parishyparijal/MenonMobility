<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class TrackListingView
{
    /**
     * Handle an incoming request.
     *
     * Track listing views with rate limiting per IP address.
     * Each IP can only increment the view count once per listing every 30 minutes.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track for successful responses
        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        $listing = $request->route('listing') ?? $request->route('slug');

        if (! $listing) {
            return $response;
        }

        // If the route parameter is a slug string, we need to resolve the listing
        // The controller will have already fetched it, so we work with the slug
        $listingIdentifier = is_object($listing) ? $listing->id : $listing;
        $ip = $request->ip();
        $cacheKey = "listing_view:{$listingIdentifier}:{$ip}";

        // Rate limit: one view per IP per listing every 30 minutes
        if (! Cache::has($cacheKey)) {
            Cache::put($cacheKey, true, now()->addMinutes(30));

            // If the listing is an Eloquent model, increment directly
            if (is_object($listing) && method_exists($listing, 'increment')) {
                $listing->increment('view_count');
            }
        }

        return $response;
    }
}
