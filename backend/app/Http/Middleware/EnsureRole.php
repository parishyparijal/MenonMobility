<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Admin can access everything
        if ($user->role === UserRole::Admin) {
            return $next($request);
        }

        $allowedRoles = array_map(
            fn (string $role) => UserRole::tryFrom($role),
            $roles,
        );

        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json([
                'message' => 'You do not have the required role to access this resource.',
            ], 403);
        }

        return $next($request);
    }
}
