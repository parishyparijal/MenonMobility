<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminUserController extends Controller
{
    /**
     * List paginated users with filters.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::query()->with('sellerProfile');

        // Filter by role
        if ($request->filled('role')) {
            $role = UserRole::tryFrom($request->input('role'));
            if ($role) {
                $query->where('role', $role);
            }
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', (bool) $request->input('is_active'));
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"),
            );
        }

        $perPage = min((int) $request->input('per_page', 25), 100);

        return UserResource::collection(
            $query->latest()->paginate($perPage),
        );
    }

    /**
     * Show user details.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('sellerProfile');

        return response()->json([
            'data' => new UserResource($user),
            'stats' => [
                'total_listings' => $user->listings()->count(),
                'active_listings' => $user->listings()->where('status', 'active')->count(),
                'total_favorites' => $user->favorites()->count(),
            ],
        ]);
    }

    /**
     * Toggle user active status (enable/disable).
     */
    public function toggleActive(User $user): JsonResponse
    {
        // Prevent disabling yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot deactivate your own account.',
            ], 422);
        }

        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        // If deactivating, revoke all tokens
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_active
                ? 'User account activated.'
                : 'User account deactivated.',
            'data' => new UserResource($user),
        ]);
    }
}
