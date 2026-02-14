<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Models\BrandModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminBrandController extends Controller
{
    // -------------------------------------------------------------------------
    // Brands
    // -------------------------------------------------------------------------

    /**
     * List all brands (including inactive) with their models.
     */
    public function index(): AnonymousResourceCollection
    {
        $brands = Brand::query()
            ->with(['models' => fn ($q) => $q->orderBy('name')])
            ->orderBy('name')
            ->get();

        return BrandResource::collection($brands);
    }

    /**
     * Create a new brand.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:brands,name'],
            'logo_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $brand = Brand::create($validated);

        return response()->json([
            'message' => 'Brand created.',
            'data' => new BrandResource($brand),
        ], 201);
    }

    /**
     * Show a single brand with models.
     */
    public function show(Brand $brand): JsonResponse
    {
        $brand->load(['models' => fn ($q) => $q->orderBy('name')]);

        return response()->json([
            'data' => new BrandResource($brand),
        ]);
    }

    /**
     * Update a brand.
     */
    public function update(Request $request, Brand $brand): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', "unique:brands,name,{$brand->id}"],
            'logo_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $brand->update($validated);

        return response()->json([
            'message' => 'Brand updated.',
            'data' => new BrandResource($brand->fresh()->load('models')),
        ]);
    }

    /**
     * Delete a brand.
     */
    public function destroy(Brand $brand): JsonResponse
    {
        // Check if brand is used in listings
        $listingsCount = $brand->listings()->count() ?? 0;
        if ($listingsCount > 0) {
            return response()->json([
                'message' => "Cannot delete brand. It is referenced by {$listingsCount} listing(s).",
            ], 422);
        }

        $brand->models()->delete();
        $brand->delete();

        return response()->json([
            'message' => 'Brand and its models deleted.',
        ]);
    }

    // -------------------------------------------------------------------------
    // Brand Models
    // -------------------------------------------------------------------------

    /**
     * Add a model to a brand.
     */
    public function storeModel(Request $request, Brand $brand): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $model = $brand->models()->create($validated);

        return response()->json([
            'message' => 'Brand model created.',
            'data' => [
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'is_active' => $model->is_active,
            ],
        ], 201);
    }

    /**
     * Update a brand model.
     */
    public function updateModel(Request $request, Brand $brand, BrandModel $model): JsonResponse
    {
        if ($model->brand_id !== $brand->id) {
            return response()->json(['message' => 'Model does not belong to this brand.'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $model->update($validated);

        return response()->json([
            'message' => 'Brand model updated.',
            'data' => [
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'is_active' => $model->is_active,
            ],
        ]);
    }

    /**
     * Delete a brand model.
     */
    public function destroyModel(Brand $brand, BrandModel $model): JsonResponse
    {
        if ($model->brand_id !== $brand->id) {
            return response()->json(['message' => 'Model does not belong to this brand.'], 404);
        }

        $model->delete();

        return response()->json([
            'message' => 'Brand model deleted.',
        ]);
    }
}
