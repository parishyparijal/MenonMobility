<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BrandController extends Controller
{
    /**
     * List all active brands with their models.
     * Optionally filter by category_id.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Brand::query()
            ->where('is_active', true)
            ->with(['models' => fn ($q) => $q->where('is_active', true)->orderBy('name')]);

        // Filter brands by category if provided
        if ($request->filled('category_id')) {
            $query->whereHas('categories', fn ($q) => $q->where('categories.id', (int) $request->input('category_id')));
        }

        $brands = $query->orderBy('name')->get();

        return BrandResource::collection($brands);
    }

    /**
     * Show a single brand with its models.
     */
    public function show(string $slug): JsonResponse
    {
        $brand = Brand::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['models' => fn ($q) => $q->where('is_active', true)->orderBy('name')])
            ->firstOrFail();

        return response()->json([
            'data' => new BrandResource($brand),
        ]);
    }
}
