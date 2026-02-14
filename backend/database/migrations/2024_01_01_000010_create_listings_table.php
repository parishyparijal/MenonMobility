<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->foreignId('brand_model_id')->nullable()->constrained('brand_models')->nullOnDelete();

            // Core details
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Pricing
            $table->decimal('price', 12, 2)->nullable();
            $table->string('price_currency', 10)->default('EUR');
            $table->boolean('price_on_request')->default(false);

            // Status
            $table->enum('condition', ['new', 'used']);
            $table->enum('status', ['draft', 'pending_review', 'active', 'sold', 'expired', 'rejected'])->default('draft');

            // Vehicle specs
            $table->smallInteger('year')->nullable();
            $table->unsignedInteger('mileage_km')->nullable();
            $table->unsignedInteger('hours')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('transmission')->nullable();
            $table->unsignedInteger('power_hp')->nullable();
            $table->unsignedInteger('power_kw')->nullable();
            $table->string('color')->nullable();
            $table->string('vin')->nullable();

            // Truck-specific specs
            $table->unsignedInteger('gvw_kg')->nullable();
            $table->unsignedInteger('payload_kg')->nullable();
            $table->smallInteger('axle_count')->nullable();
            $table->string('cab_type')->nullable();
            $table->string('emission_class')->nullable();
            $table->unsignedInteger('wheelbase_mm')->nullable();

            // Location
            $table->string('country_code', 10)->default('NL');
            $table->string('region')->nullable();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Contact
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_whatsapp')->nullable();

            // Counters
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('favorite_count')->default(0);
            $table->unsignedSmallInteger('image_count')->default(0);

            // Featured
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_until')->nullable();

            // Dates
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('sold_at')->nullable();
            $table->string('rejected_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('status');
            $table->index('slug');
            $table->index(['status', 'category_id']);
            $table->index(['status', 'created_at']);
            $table->index('price');
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
