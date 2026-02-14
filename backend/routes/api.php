<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically by Laravel 11.
|
*/

// =============================================================================
// Public Routes (No Authentication Required)
// =============================================================================

Route::prefix('v1')->group(function () {

    // -------------------------------------------------------------------------
    // Listings - Public Browse & Search
    // -------------------------------------------------------------------------
    Route::prefix('listings')->group(function () {
        Route::get('/', 'App\Http\Controllers\Api\ListingController@index')
            ->name('listings.index');
        Route::get('/featured', 'App\Http\Controllers\Api\ListingController@featured')
            ->name('listings.featured');
        Route::get('/latest', 'App\Http\Controllers\Api\ListingController@latest')
            ->name('listings.latest');
        Route::get('/search', 'App\Http\Controllers\Api\ListingController@search')
            ->name('listings.search');
        Route::get('/{listing:slug}', 'App\Http\Controllers\Api\ListingController@show')
            ->name('listings.show');
    });

    // -------------------------------------------------------------------------
    // Categories
    // -------------------------------------------------------------------------
    Route::prefix('categories')->group(function () {
        Route::get('/', 'App\Http\Controllers\Api\CategoryController@index')
            ->name('categories.index');
        Route::get('/{category:slug}', 'App\Http\Controllers\Api\CategoryController@show')
            ->name('categories.show');
        Route::get('/{category:slug}/listings', 'App\Http\Controllers\Api\CategoryController@listings')
            ->name('categories.listings');
    });

    // -------------------------------------------------------------------------
    // Brands
    // -------------------------------------------------------------------------
    Route::prefix('brands')->group(function () {
        Route::get('/', 'App\Http\Controllers\Api\BrandController@index')
            ->name('brands.index');
        Route::get('/{brand:slug}', 'App\Http\Controllers\Api\BrandController@show')
            ->name('brands.show');
        Route::get('/{brand:slug}/models', 'App\Http\Controllers\Api\BrandController@models')
            ->name('brands.models');
    });

    // -------------------------------------------------------------------------
    // Sellers - Public Profiles
    // -------------------------------------------------------------------------
    Route::prefix('sellers')->group(function () {
        Route::get('/', 'App\Http\Controllers\Api\SellerController@index')
            ->name('sellers.index');
        Route::get('/{sellerProfile:slug}', 'App\Http\Controllers\Api\SellerController@show')
            ->name('sellers.show');
        Route::get('/{sellerProfile:slug}/listings', 'App\Http\Controllers\Api\SellerController@listings')
            ->name('sellers.listings');
    });

    // -------------------------------------------------------------------------
    // Locations
    // -------------------------------------------------------------------------
    Route::get('/locations', 'App\Http\Controllers\Api\LocationController@index')
        ->name('locations.index');

    // -------------------------------------------------------------------------
    // Enums / Filter Options
    // -------------------------------------------------------------------------
    Route::get('/filter-options', 'App\Http\Controllers\Api\FilterController@index')
        ->name('filters.index');

    // =========================================================================
    // Authentication
    // =========================================================================
    Route::prefix('auth')->group(function () {
        Route::post('/register', 'App\Http\Controllers\Api\AuthController@register')
            ->name('auth.register');
        Route::post('/login', 'App\Http\Controllers\Api\AuthController@login')
            ->name('auth.login');
        Route::post('/forgot-password', 'App\Http\Controllers\Api\AuthController@forgotPassword')
            ->name('auth.forgot-password');
        Route::post('/reset-password', 'App\Http\Controllers\Api\AuthController@resetPassword')
            ->name('auth.reset-password');
    });

    // =========================================================================
    // Authenticated Routes
    // =========================================================================
    Route::middleware('auth:sanctum')->group(function () {

        // ---------------------------------------------------------------------
        // Auth - Session Management
        // ---------------------------------------------------------------------
        Route::prefix('auth')->group(function () {
            Route::post('/logout', 'App\Http\Controllers\Api\AuthController@logout')
                ->name('auth.logout');
            Route::get('/user', 'App\Http\Controllers\Api\AuthController@user')
                ->name('auth.user');
            Route::put('/user', 'App\Http\Controllers\Api\AuthController@updateProfile')
                ->name('auth.update-profile');
            Route::put('/user/password', 'App\Http\Controllers\Api\AuthController@updatePassword')
                ->name('auth.update-password');
        });

        // ---------------------------------------------------------------------
        // Favorites
        // ---------------------------------------------------------------------
        Route::prefix('favorites')->group(function () {
            Route::get('/', 'App\Http\Controllers\Api\FavoriteController@index')
                ->name('favorites.index');
            Route::post('/{listing}', 'App\Http\Controllers\Api\FavoriteController@toggle')
                ->name('favorites.toggle');
            Route::delete('/{listing}', 'App\Http\Controllers\Api\FavoriteController@destroy')
                ->name('favorites.destroy');
        });

        // ---------------------------------------------------------------------
        // Saved Searches
        // ---------------------------------------------------------------------
        Route::prefix('saved-searches')->group(function () {
            Route::get('/', 'App\Http\Controllers\Api\SavedSearchController@index')
                ->name('saved-searches.index');
            Route::post('/', 'App\Http\Controllers\Api\SavedSearchController@store')
                ->name('saved-searches.store');
            Route::put('/{savedSearch}', 'App\Http\Controllers\Api\SavedSearchController@update')
                ->name('saved-searches.update');
            Route::delete('/{savedSearch}', 'App\Http\Controllers\Api\SavedSearchController@destroy')
                ->name('saved-searches.destroy');
        });

        // ---------------------------------------------------------------------
        // Messages
        // ---------------------------------------------------------------------
        Route::prefix('messages')->group(function () {
            Route::get('/threads', 'App\Http\Controllers\Api\MessageController@threads')
                ->name('messages.threads');
            Route::get('/threads/{thread}', 'App\Http\Controllers\Api\MessageController@show')
                ->name('messages.show');
            Route::post('/threads/{thread}/reply', 'App\Http\Controllers\Api\MessageController@reply')
                ->name('messages.reply');
            Route::put('/threads/{thread}/archive', 'App\Http\Controllers\Api\MessageController@archive')
                ->name('messages.archive');
            Route::get('/unread-count', 'App\Http\Controllers\Api\MessageController@unreadCount')
                ->name('messages.unread-count');
        });

        // ---------------------------------------------------------------------
        // Contact Seller (creates a message thread)
        // ---------------------------------------------------------------------
        Route::post('/listings/{listing:slug}/contact', 'App\Http\Controllers\Api\MessageController@contactSeller')
            ->name('listings.contact-seller');

        // =====================================================================
        // Seller Routes
        // =====================================================================
        Route::middleware('role:seller')->prefix('seller')->group(function () {

            // -----------------------------------------------------------------
            // Seller Dashboard
            // -----------------------------------------------------------------
            Route::get('/dashboard', 'App\Http\Controllers\Api\Seller\DashboardController@index')
                ->name('seller.dashboard');
            Route::get('/dashboard/stats', 'App\Http\Controllers\Api\Seller\DashboardController@stats')
                ->name('seller.dashboard.stats');

            // -----------------------------------------------------------------
            // Seller Profile
            // -----------------------------------------------------------------
            Route::get('/profile', 'App\Http\Controllers\Api\Seller\ProfileController@show')
                ->name('seller.profile.show');
            Route::put('/profile', 'App\Http\Controllers\Api\Seller\ProfileController@update')
                ->name('seller.profile.update');
            Route::post('/profile/logo', 'App\Http\Controllers\Api\Seller\ProfileController@uploadLogo')
                ->name('seller.profile.upload-logo');

            // -----------------------------------------------------------------
            // Seller Listings CRUD
            // -----------------------------------------------------------------
            Route::prefix('listings')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Seller\ListingController@index')
                    ->name('seller.listings.index');
                Route::post('/', 'App\Http\Controllers\Api\Seller\ListingController@store')
                    ->name('seller.listings.store');
                Route::get('/{listing}', 'App\Http\Controllers\Api\Seller\ListingController@show')
                    ->name('seller.listings.show');
                Route::put('/{listing}', 'App\Http\Controllers\Api\Seller\ListingController@update')
                    ->name('seller.listings.update');
                Route::delete('/{listing}', 'App\Http\Controllers\Api\Seller\ListingController@destroy')
                    ->name('seller.listings.destroy');

                // Status changes
                Route::post('/{listing}/publish', 'App\Http\Controllers\Api\Seller\ListingController@publish')
                    ->name('seller.listings.publish');
                Route::post('/{listing}/mark-sold', 'App\Http\Controllers\Api\Seller\ListingController@markSold')
                    ->name('seller.listings.mark-sold');

                // Image management
                Route::post('/{listing}/images', 'App\Http\Controllers\Api\Seller\ListingImageController@store')
                    ->name('seller.listings.images.store');
                Route::put('/{listing}/images/reorder', 'App\Http\Controllers\Api\Seller\ListingImageController@reorder')
                    ->name('seller.listings.images.reorder');
                Route::put('/{listing}/images/{image}/primary', 'App\Http\Controllers\Api\Seller\ListingImageController@setPrimary')
                    ->name('seller.listings.images.set-primary');
                Route::delete('/{listing}/images/{image}', 'App\Http\Controllers\Api\Seller\ListingImageController@destroy')
                    ->name('seller.listings.images.destroy');
            });
        });

        // =====================================================================
        // Admin Routes
        // =====================================================================
        Route::middleware('role:admin')->prefix('admin')->group(function () {

            // -----------------------------------------------------------------
            // Admin Dashboard & Analytics
            // -----------------------------------------------------------------
            Route::get('/dashboard', 'App\Http\Controllers\Api\Admin\DashboardController@index')
                ->name('admin.dashboard');
            Route::get('/analytics', 'App\Http\Controllers\Api\Admin\AnalyticsController@index')
                ->name('admin.analytics');
            Route::get('/analytics/listings', 'App\Http\Controllers\Api\Admin\AnalyticsController@listings')
                ->name('admin.analytics.listings');
            Route::get('/analytics/users', 'App\Http\Controllers\Api\Admin\AnalyticsController@users')
                ->name('admin.analytics.users');
            Route::get('/analytics/revenue', 'App\Http\Controllers\Api\Admin\AnalyticsController@revenue')
                ->name('admin.analytics.revenue');

            // -----------------------------------------------------------------
            // Listing Moderation
            // -----------------------------------------------------------------
            Route::prefix('listings')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Admin\ListingController@index')
                    ->name('admin.listings.index');
                Route::get('/pending', 'App\Http\Controllers\Api\Admin\ListingController@pending')
                    ->name('admin.listings.pending');
                Route::get('/{listing}', 'App\Http\Controllers\Api\Admin\ListingController@show')
                    ->name('admin.listings.show');
                Route::post('/{listing}/approve', 'App\Http\Controllers\Api\Admin\ListingController@approve')
                    ->name('admin.listings.approve');
                Route::post('/{listing}/reject', 'App\Http\Controllers\Api\Admin\ListingController@reject')
                    ->name('admin.listings.reject');
                Route::delete('/{listing}', 'App\Http\Controllers\Api\Admin\ListingController@destroy')
                    ->name('admin.listings.destroy');
            });

            // -----------------------------------------------------------------
            // User Management
            // -----------------------------------------------------------------
            Route::prefix('users')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Admin\UserController@index')
                    ->name('admin.users.index');
                Route::get('/{user}', 'App\Http\Controllers\Api\Admin\UserController@show')
                    ->name('admin.users.show');
                Route::put('/{user}', 'App\Http\Controllers\Api\Admin\UserController@update')
                    ->name('admin.users.update');
                Route::put('/{user}/role', 'App\Http\Controllers\Api\Admin\UserController@updateRole')
                    ->name('admin.users.update-role');
                Route::put('/{user}/toggle-active', 'App\Http\Controllers\Api\Admin\UserController@toggleActive')
                    ->name('admin.users.toggle-active');
                Route::delete('/{user}', 'App\Http\Controllers\Api\Admin\UserController@destroy')
                    ->name('admin.users.destroy');
            });

            // -----------------------------------------------------------------
            // Category Management
            // -----------------------------------------------------------------
            Route::prefix('categories')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Admin\CategoryController@index')
                    ->name('admin.categories.index');
                Route::post('/', 'App\Http\Controllers\Api\Admin\CategoryController@store')
                    ->name('admin.categories.store');
                Route::get('/{category}', 'App\Http\Controllers\Api\Admin\CategoryController@show')
                    ->name('admin.categories.show');
                Route::put('/{category}', 'App\Http\Controllers\Api\Admin\CategoryController@update')
                    ->name('admin.categories.update');
                Route::delete('/{category}', 'App\Http\Controllers\Api\Admin\CategoryController@destroy')
                    ->name('admin.categories.destroy');
            });

            // -----------------------------------------------------------------
            // Brand Management
            // -----------------------------------------------------------------
            Route::prefix('brands')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Admin\BrandController@index')
                    ->name('admin.brands.index');
                Route::post('/', 'App\Http\Controllers\Api\Admin\BrandController@store')
                    ->name('admin.brands.store');
                Route::get('/{brand}', 'App\Http\Controllers\Api\Admin\BrandController@show')
                    ->name('admin.brands.show');
                Route::put('/{brand}', 'App\Http\Controllers\Api\Admin\BrandController@update')
                    ->name('admin.brands.update');
                Route::delete('/{brand}', 'App\Http\Controllers\Api\Admin\BrandController@destroy')
                    ->name('admin.brands.destroy');
                Route::post('/{brand}/models', 'App\Http\Controllers\Api\Admin\BrandController@storeModel')
                    ->name('admin.brands.models.store');
                Route::put('/{brand}/models/{brandModel}', 'App\Http\Controllers\Api\Admin\BrandController@updateModel')
                    ->name('admin.brands.models.update');
                Route::delete('/{brand}/models/{brandModel}', 'App\Http\Controllers\Api\Admin\BrandController@destroyModel')
                    ->name('admin.brands.models.destroy');
            });

            // -----------------------------------------------------------------
            // Seller Verification
            // -----------------------------------------------------------------
            Route::prefix('sellers')->group(function () {
                Route::get('/', 'App\Http\Controllers\Api\Admin\SellerController@index')
                    ->name('admin.sellers.index');
                Route::get('/pending', 'App\Http\Controllers\Api\Admin\SellerController@pending')
                    ->name('admin.sellers.pending');
                Route::post('/{sellerProfile}/verify', 'App\Http\Controllers\Api\Admin\SellerController@verify')
                    ->name('admin.sellers.verify');
                Route::post('/{sellerProfile}/unverify', 'App\Http\Controllers\Api\Admin\SellerController@unverify')
                    ->name('admin.sellers.unverify');
            });
        });
    });
});
