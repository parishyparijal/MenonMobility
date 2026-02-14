<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminCategoryController extends Controller
{
    /**
     * List all categories (including inactive).
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Create a new category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Show a single category.
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['children', 'parent']);

        return response()->json([
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Update a category.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Prevent setting parent_id to self or own child
        if (isset($validated['parent_id']) && $validated['parent_id'] === $category->id) {
            return response()->json([
                'message' => 'A category cannot be its own parent.',
            ], 422);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated.',
            'data' => new CategoryResource($category->fresh()),
        ]);
    }

    /**
     * Delete a category.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has listings
        if ($category->listing_count > 0) {
            return response()->json([
                'message' => 'Cannot delete a category that has listings. Reassign listings first.',
            ], 422);
        }

        // Check if category has children
        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that has subcategories. Delete subcategories first.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted.',
        ]);
    }
}
