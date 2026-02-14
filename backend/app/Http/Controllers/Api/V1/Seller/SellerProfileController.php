<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSellerProfileRequest;
use App\Http\Resources\SellerProfileResource;
use App\Models\SellerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SellerProfileController extends Controller
{
    /**
     * Get the authenticated seller's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->sellerProfile;

        if (! $profile) {
            return response()->json([
                'message' => 'Seller profile not found. Please create one.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'data' => new SellerProfileResource($profile),
        ]);
    }

    /**
     * Update the authenticated seller's profile.
     */
    public function update(UpdateSellerProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($user->sellerProfile?->logo) {
                Storage::disk('public')->delete($user->sellerProfile->logo);
            }

            $validated['logo'] = $request->file('logo')->store('seller-logos', 'public');
        }

        $profile = SellerProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated,
        );

        return response()->json([
            'message' => 'Seller profile updated.',
            'data' => new SellerProfileResource($profile->fresh()),
        ]);
    }
}
