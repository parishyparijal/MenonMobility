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
        Schema::create('featured_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->string('placement'); // e.g. 'homepage', 'category', 'search'
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->decimal('price_paid', 8, 2);
            $table->string('stripe_payment_id')->nullable();
            $table->timestamps();

            $table->index(['placement', 'starts_at', 'ends_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_listings');
    }
};
