<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SavedSearchRequest;
use App\Models\SavedSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedSearchController extends Controller
{
    /**
     * List the authenticated user's saved searches.
     */
    public function index(Request $request): JsonResponse
    {
        $savedSearches = $request->user()
            ->savedSearches()
            ->latest()
            ->get();

        return response()->json([
            'data' => $savedSearches,
        ]);
    }

    /**
     * Create a new saved search.
     */
    public function store(SavedSearchRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $savedSearch = $request->user()->savedSearches()->create([
            'name' => $validated['name'],
            'filters' => $validated['filters'],
            'email_frequency' => $validated['email_frequency'],
        ]);

        return response()->json([
            'message' => 'Saved search created.',
            'data' => $savedSearch,
        ], 201);
    }

    /**
     * Update an existing saved search.
     */
    public function update(SavedSearchRequest $request, SavedSearch $savedSearch): JsonResponse
    {
        // Ensure the saved search belongs to the authenticated user
        if ($savedSearch->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validated();

        $savedSearch->update([
            'name' => $validated['name'],
            'filters' => $validated['filters'],
            'email_frequency' => $validated['email_frequency'],
        ]);

        return response()->json([
            'message' => 'Saved search updated.',
            'data' => $savedSearch->fresh(),
        ]);
    }

    /**
     * Delete a saved search.
     */
    public function destroy(Request $request, SavedSearch $savedSearch): JsonResponse
    {
        // Ensure the saved search belongs to the authenticated user
        if ($savedSearch->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $savedSearch->delete();

        return response()->json([
            'message' => 'Saved search deleted.',
        ]);
    }
}
