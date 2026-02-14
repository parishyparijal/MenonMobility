# ===========================================================
# PHP 8.3 FPM – Laravel backend
# ===========================================================
FROM php:8.3-fpm-alpine

# -----------------------------------------------------------
# Install system dependencies
# -----------------------------------------------------------
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    imagemagick-dev \
    icu-dev \
    libexif-dev \
    oniguruma-dev \
    linux-headers \
    $PHPIZE_DEPS

# -----------------------------------------------------------
# Install PHP extensions
# -----------------------------------------------------------
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        gd \
        pcntl \
        zip \
        exif \
        intl \
        bcmath \
        mbstring \
        opcache

# Install imagick via PECL
RUN pecl install imagick \
    && docker-php-ext-enable imagick

# Install Redis via PECL
RUN pecl install redis \
    && docker-php-ext-enable redis

# -----------------------------------------------------------
# Install Composer
# -----------------------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# -----------------------------------------------------------
# Set working directory
# -----------------------------------------------------------
WORKDIR /var/www/backend

# -----------------------------------------------------------
# Copy composer files and install dependencies first (layer caching)
# -----------------------------------------------------------
COPY backend/composer.json backend/composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction \
    || true

# -----------------------------------------------------------
# Copy application files
# -----------------------------------------------------------
COPY backend/ .

# -----------------------------------------------------------
# Finish composer install (generate autoloader, run scripts)
# -----------------------------------------------------------
RUN composer dump-autoload --optimize --no-interaction || true

# -----------------------------------------------------------
# Set permissions
# -----------------------------------------------------------
RUN chown -R www-data:www-data /var/www/backend \
    && chmod -R 755 /var/www/backend/storage 2>/dev/null || true \
    && chmod -R 755 /var/www/backend/bootstrap/cache 2>/dev/null || true

# -----------------------------------------------------------
# Expose PHP-FPM port
# -----------------------------------------------------------
EXPOSE 9000

CMD ["php-fpm"]
