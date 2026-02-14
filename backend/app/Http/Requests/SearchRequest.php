<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'min_year' => ['nullable', 'integer', 'min:1900'],
            'max_year' => ['nullable', 'integer', 'max:' . (date('Y') + 1)],
            'condition' => ['nullable', 'in:new,used'],
            'fuel_type' => ['nullable', 'string', 'max:50'],
            'transmission' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:10'],
            'sort' => ['nullable', 'in:relevance,price_asc,price_desc,date_desc,year_desc,mileage_asc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
