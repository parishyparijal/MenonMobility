<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\EmissionClass;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateListingRequest extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:255'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_currency' => ['sometimes', 'string', 'max:10'],
            'price_on_request' => ['sometimes', 'boolean'],
            'condition' => ['sometimes', new Enum(VehicleCondition::class)],
            'brand_id' => ['sometimes', 'nullable', 'integer', 'exists:brands,id'],
            'brand_model_id' => ['sometimes', 'nullable', 'integer', 'exists:brand_models,id'],
            'year' => ['sometimes', 'nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'mileage_km' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'hours' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'fuel_type' => ['sometimes', 'nullable', new Enum(FuelType::class)],
            'transmission' => ['sometimes', 'nullable', new Enum(TransmissionType::class)],
            'power_hp' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'power_kw' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'color' => ['sometimes', 'nullable', 'string', 'max:50'],
            'vin' => ['sometimes', 'nullable', 'string', 'max:17'],
            'gvw_kg' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'payload_kg' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'axle_count' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:10'],
            'cab_type' => ['sometimes', 'nullable', 'string', 'max:50'],
            'emission_class' => ['sometimes', 'nullable', new Enum(EmissionClass::class)],
            'wheelbase_mm' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'country_code' => ['sometimes', 'string', 'size:2'],
            'region' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'contact_phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_whatsapp' => ['sometimes', 'nullable', 'string', 'max:30'],
        ];
    }
}
