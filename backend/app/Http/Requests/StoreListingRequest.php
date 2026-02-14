<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\EmissionClass;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreListingRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'price' => ['required_without:price_on_request', 'nullable', 'numeric', 'min:0'],
            'price_currency' => ['sometimes', 'string', 'max:10'],
            'price_on_request' => ['sometimes', 'boolean'],
            'condition' => ['required', new Enum(VehicleCondition::class)],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'brand_model_id' => ['nullable', 'integer', 'exists:brand_models,id'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'mileage_km' => ['nullable', 'integer', 'min:0'],
            'hours' => ['nullable', 'integer', 'min:0'],
            'fuel_type' => ['nullable', new Enum(FuelType::class)],
            'transmission' => ['nullable', new Enum(TransmissionType::class)],
            'power_hp' => ['nullable', 'integer', 'min:0'],
            'power_kw' => ['nullable', 'integer', 'min:0'],
            'color' => ['nullable', 'string', 'max:50'],
            'vin' => ['nullable', 'string', 'max:17'],
            'gvw_kg' => ['nullable', 'integer', 'min:0'],
            'payload_kg' => ['nullable', 'integer', 'min:0'],
            'axle_count' => ['nullable', 'integer', 'min:1', 'max:10'],
            'cab_type' => ['nullable', 'string', 'max:50'],
            'emission_class' => ['nullable', new Enum(EmissionClass::class)],
            'wheelbase_mm' => ['nullable', 'integer', 'min:0'],
            'country_code' => ['required', 'string', 'size:2'],
            'region' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_whatsapp' => ['nullable', 'string', 'max:30'],
        ];
    }
}
