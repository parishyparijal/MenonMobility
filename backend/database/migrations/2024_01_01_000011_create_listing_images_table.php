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
        Schema::create('listing_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->smallInteger('position')->default(0);

            // Image URLs for different sizes
            $table->string('original_url');
            $table->string('large_url')->nullable();
            $table->string('medium_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('webp_url')->nullable();

            // Metadata
            $table->string('alt_text')->nullable();
            $table->unsignedInteger('file_size')->nullable();
            $table->unsignedSmallInteger('width')->nullable();
            $table->unsignedSmallInteger('height')->nullable();

            $table->timestamps();

            $table->index('listing_id');
            $table->unique(['listing_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_images');
    }
};
