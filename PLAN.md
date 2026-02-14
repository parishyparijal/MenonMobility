# MenonTrucks - Ultra-Detailed Implementation Plan (35 Phases)

## Context
Building a **full-fledged multi-vendor vehicle marketplace** called **MenonTrucks** for client **Menon Mobility**. Reference: [TrucksNL.com](https://www.trucksnl.com/) but significantly MORE feature-rich. The platform supports dealers and individuals listing ALL types of vehicles (trucks, trailers, equipment, vans, cars, containers, parts). Target: 150K+ listings, European market (NL/DE/UK).

**What makes this BETTER than TrucksNL:**
- Dealer verification system with buyer reviews & trust scores
- Built-in finance calculator & insurance quotes
- Vehicle history reports (VIN check, inspection, damage history)
- Full real-time: live chat, instant push notifications, real-time updates
- 3 languages: English, Dutch, German (i18n from day 1)
- Mixed monetization: subscriptions + featured listings + banner ads
- Modern PWA-ready responsive design
- 44+ vehicle categories (matching TrucksNL coverage)

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | **Nuxt 3** (Vue 3) with SSR |
| Backend | **Laravel 11** API (PHP 8.3) |
| Database | **PostgreSQL 16** |
| Search | **Elasticsearch 8** |
| Cache/Queue | **Redis 7** |
| Real-time | **Laravel Reverb** (WebSockets) + **Pusher protocol** |
| Storage | **S3-compatible** (MinIO local, AWS S3 prod) |
| Styling | **Tailwind CSS 3** |
| Auth | **Laravel Sanctum** (token-based) |
| Payments | **Stripe** (Laravel Cashier) |
| i18n | **@nuxtjs/i18n** (EN/NL/DE) |
| Infrastructure | **Docker** + **Nginx** reverse proxy |
| CDN | **Cloudflare** |
| Monitoring | **Sentry** + **Laravel Telescope** |

## Brand Colors
- Navy Blue: `#1E2B47` (primary)
- Orange: `#FF6B35` (accent/CTA)
- Orange Light: `#FF8C5E` (hover states)
- Orange Lighter: `#FFF3ED` (backgrounds)
- Gray scale: `#F8F9FA` to `#1A1A2E`

---

# THE 35 PHASES

---

## PHASE 1: Project Setup & Docker Infrastructure
**Priority: CRITICAL | Estimated: 2 days**

Everything starts here. Without Docker, nothing runs.

### Tasks:
1. Create monorepo directory structure:
   ```
   menontrucks/
   ├── docker/          (nginx, php, node configs)
   ├── backend/         (Laravel 11)
   ├── frontend/        (Nuxt 3)
   ├── docker-compose.yml
   ├── Makefile
   └── .env.example
   ```
2. Write `docker-compose.yml` with 10 services:
   - nginx (1.25-alpine, port 80) — reverse proxy
   - php (8.3-FPM custom) — Laravel API
   - node (20-alpine custom) — Nuxt dev server
   - postgres (16-alpine, port 5432) — database
   - redis (7-alpine, port 6379) — cache/queue/sessions
   - elasticsearch (8.12.0, port 9200) — search engine
   - minio (port 9000/9001) — S3-compatible storage
   - mailpit (port 8025) — email testing
   - queue-worker — background jobs
   - scheduler — cron tasks
3. Write `docker/php/Dockerfile` (PHP 8.3-FPM + extensions: pdo_pgsql, redis, gd, imagick, pcntl, zip, exif, intl, bcmath)
4. Write `docker/node/Dockerfile` (Node 20 + npm)
5. Write `docker/nginx/default.conf` (reverse proxy: /api→php, everything else→node, gzip, 50M upload)
6. Write `Makefile` (up, down, restart, fresh, migrate, seed, shell, logs, test, install)
7. Write `.env.example` with all service environment variables
8. Write `.gitignore` (node_modules, vendor, .env, .nuxt, storage logs)

### Verification:
- `docker compose build` succeeds without errors
- `docker compose up -d` starts all 10 services
- `curl localhost` returns nginx response

### Files:
- `docker-compose.yml`
- `docker/php/Dockerfile`
- `docker/node/Dockerfile`
- `docker/nginx/default.conf`
- `Makefile`
- `.env.example`
- `.gitignore`

---

## PHASE 2: Laravel 11 Backend Initialization
**Priority: CRITICAL | Estimated: 1 day**

Set up Laravel with all required packages and configuration.

### Tasks:
1. `composer.json` with dependencies:
   - laravel/framework, laravel/sanctum, laravel/cashier
   - intervention/image (v3), elasticsearch/elasticsearch
   - league/flysystem-aws-s3-v3, predis/predis
   - spatie/laravel-sluggable, spatie/laravel-translatable
   - laravel/reverb (WebSockets)
2. `bootstrap/app.php` — Laravel 11 bootstrap with API routing, middleware aliases
3. Config files:
   - `config/app.php` — timezone, locale, providers
   - `config/database.php` — PostgreSQL default, Redis
   - `config/filesystems.php` — local, public, s3 disks
   - `config/sanctum.php` — 7-day token expiry
   - `config/elasticsearch.php` — host, index settings
   - `config/broadcasting.php` — Reverb/Pusher config
4. `routes/api.php` — empty but structured with route groups
5. `public/index.php` + `artisan` — standard entry points
6. `backend/.env.example`
7. `app/Providers/AppServiceProvider.php` — singleton bindings

### Verification:
- `php artisan --version` returns Laravel 11
- `php artisan route:list` shows no errors

### Files: 10 files in `backend/`

---

## PHASE 3: Nuxt 3 Frontend Initialization
**Priority: CRITICAL | Estimated: 1 day**

Set up Nuxt 3 with all modules and Tailwind configuration.

### Tasks:
1. `package.json` with dependencies:
   - nuxt (^3.14), @nuxtjs/tailwindcss, @pinia/nuxt, @nuxtjs/i18n
   - @vueuse/nuxt, vue-toastification, swiper, chart.js, vue-chartjs
   - socket.io-client (for real-time)
2. `nuxt.config.ts`:
   - SSR enabled globally
   - Runtime config (apiBase, wsUrl)
   - Modules: tailwindcss, pinia, i18n, vueuse
   - Route rules: /seller/*, /admin/* → ssr:false (SPA mode)
   - SEO defaults (title, meta description)
3. `tailwind.config.ts`:
   - Brand colors: navy, orange, orange-light, orange-lighter
   - Font: Inter
   - Container settings, custom spacing
4. `app/app.vue` — root component with NuxtLayout + Suspense
5. `tsconfig.json`
6. i18n config:
   - `i18n/locales/en.json` — English translations
   - `i18n/locales/nl.json` — Dutch translations
   - `i18n/locales/de.json` — German translations
   - Cover: navigation, buttons, forms, categories, error messages

### Verification:
- `npm run dev` starts dev server on port 3000
- Homepage renders with correct Tailwind styles
- Language switcher works between EN/NL/DE

### Files: 8+ files in `frontend/`

---

## PHASE 4: Database Schema — Core Tables (Migrations)
**Priority: CRITICAL | Estimated: 2 days**

All database tables. This is the data foundation.

### Tables (25+ tables):

**User & Auth:**
1. `users` — id, name, email, password, role (buyer/seller/admin), phone, whatsapp, avatar_url, locale (en/nl/de), is_active, email_verified_at, last_login_at, timestamps, soft_deletes
2. `personal_access_tokens` — Sanctum tokens
3. `password_reset_tokens` — password resets

**Seller:**
4. `seller_profiles` — user_id, company_name, slug, description, website, address, city, region, country_code, lat/lng, logo_url, banner_url, is_verified, verified_at, response_rate, avg_response_time, rating, review_count, timestamps
5. `seller_reviews` — buyer_id, seller_id, listing_id, rating (1-5), title, body, is_verified_purchase, seller_response, responded_at, timestamps

**Catalog:**
6. `categories` — id, parent_id, name (JSON translatable), slug, description (JSON), icon, image_url, sort_order, listing_count, is_active, meta_title, meta_description, timestamps
7. `brands` — id, name, slug, logo_url, is_active
8. `brand_category` — pivot table
9. `brand_models` — id, brand_id, name, slug, is_active

**Listings:**
10. `listings` — 50+ columns:
    - Core: title, slug, description, price, price_currency (EUR/GBP), price_on_request, price_negotiable
    - Condition: new/used/refurbished
    - Status: draft → pending_review → active → sold/expired/rejected/archived
    - Vehicle: year, mileage_km, operating_hours, fuel_type, transmission, power_hp, power_kw, color, vin
    - Truck-specific: gvw_kg, payload_kg, axle_count, cab_type, emission_class, wheelbase_mm, suspension_type
    - Container-specific: container_size (20ft/40ft), container_type
    - Location: country_code, region, city, postal_code, lat, lng
    - Contact: contact_phone, contact_email, contact_whatsapp, hide_phone
    - Stats: view_count, favorite_count, contact_count, image_count
    - Featured: is_featured, featured_until, featured_placement
    - Dates: published_at, expires_at, sold_at, rejected_reason
    - SEO: meta_title, meta_description
    - timestamps, soft_deletes
11. `listing_images` — listing_id, position, original_url, large_url, medium_url, thumbnail_url, webp_url, alt_text, file_size, dimensions
12. `specification_keys` — category_id, name (translatable), slug, unit, data_type, sort_order, is_filterable
13. `listing_specifications` — listing_id, spec_key_id, value

**Vehicle History:**
14. `vehicle_inspections` — listing_id, inspector_name, inspection_date, overall_rating, report_url, notes, is_verified
15. `vehicle_history_reports` — listing_id, vin, report_provider, accident_count, owner_count, service_records_count, report_data (JSONB), report_url

**Location:**
16. `locations` — country_code, country_name, region, city, lat, lng, postal_code

**User Interactions:**
17. `favorites` — user_id, listing_id (unique pair)
18. `saved_searches` — user_id, name, filters (JSONB), email_frequency (never/daily/weekly), last_notified_at
19. `recently_viewed` — user_id, listing_id, viewed_at
20. `listing_comparisons` — user_id, listing_ids (JSONB array, max 4)

**Messaging & Real-time:**
21. `message_threads` — listing_id, buyer_id, seller_id, last_message_at, is_archived_buyer, is_archived_seller
22. `messages` — thread_id, sender_id, body, attachments (JSONB), is_read, read_at, timestamps
23. `notifications` — user_id, type, title, body, data (JSONB), is_read, read_at, timestamps

**Monetization:**
24. `subscription_plans` — name, slug, description, price_monthly, price_yearly, max_listings, max_images, features (JSONB), stripe_monthly_id, stripe_yearly_id, sort_order
25. `user_subscriptions` — user_id, plan_id, stripe_sub_id, status, period_start, period_end, cancelled_at
26. `featured_listings` — listing_id, placement (homepage/category/search), starts_at, ends_at, price_paid, stripe_payment_id
27. `banner_ads` — title, image_url, target_url, placement, categories (JSONB), countries (JSONB), impressions, clicks, starts_at, ends_at, is_active

**Finance:**
28. `finance_inquiries` — user_id, listing_id, amount, term_months, down_payment, status, contact_phone, contact_email

**CMS/Content:**
29. `pages` — slug, title (translatable), body (translatable), is_published, sort_order
30. `faqs` — category, question (translatable), answer (translatable), sort_order

### Verification:
- `php artisan migrate` runs all migrations without errors
- `php artisan migrate:rollback` works cleanly
- All foreign keys and indexes are correct

### Files: 30 migration files in `database/migrations/`

---

## PHASE 5: Eloquent Models & Relationships
**Priority: CRITICAL | Estimated: 2 days**

Every model with complete relationships, casts, scopes, and accessors.

### Models (25+):
1. **User** — HasApiTokens, roles, relationships (listings, favorites, threads, subscription, reviews_given, reviews_received, notifications, recently_viewed)
2. **SellerProfile** — sluggable, translatable description, belongsTo user, reviews, verification
3. **SellerReview** — belongsTo buyer/seller/listing, rating validation
4. **Category** — self-referencing tree, translatable name/description, hasMany listings
5. **Brand** — sluggable, belongsToMany categories, hasMany models
6. **BrandModel** — belongsTo brand
7. **Location** — hasMany listings
8. **Listing** — THE main model, 15+ relationships, 10+ scopes, sluggable, enum casts for status/condition/fuel/transmission/emission
9. **ListingImage** — belongsTo listing, position ordering
10. **SpecificationKey** — translatable, belongsTo category
11. **ListingSpecification** — belongsTo listing + specKey
12. **VehicleInspection** — belongsTo listing
13. **VehicleHistoryReport** — belongsTo listing
14. **Favorite** — belongsTo user + listing
15. **SavedSearch** — belongsTo user, JSONB cast
16. **RecentlyViewed** — belongsTo user + listing
17. **MessageThread** — belongsTo listing/buyer/seller, hasMany messages
18. **Message** — belongsTo thread/sender
19. **Notification** — belongsTo user, morphable
20. **SubscriptionPlan** — features JSON
21. **UserSubscription** — belongsTo user + plan
22. **FeaturedListing** — belongsTo listing
23. **BannerAd** — placements, click tracking
24. **FinanceInquiry** — belongsTo user + listing
25. **Page** — translatable CMS content
26. **Faq** — translatable

### Enums (PHP 8.1 backed):
- ListingStatus (draft, pending_review, active, sold, expired, rejected, archived)
- UserRole (buyer, seller, admin)
- VehicleCondition (new, used, refurbished)
- FuelType (diesel, petrol, electric, hybrid, lpg, cng, hydrogen)
- TransmissionType (manual, automatic, semi_automatic)
- EmissionClass (euro1-euro6, euro6d)
- ContainerSize (20ft, 40ft, 45ft)

### Files: 26 model files + 7 enum files

---

## PHASE 6: Enums, Form Requests & Validation
**Priority: HIGH | Estimated: 1 day**

All request validation classes with proper rules.

### Form Requests (15+):
1. RegisterRequest — name, email (unique), password (confirmed, min:8), role
2. LoginRequest — email, password
3. ForgotPasswordRequest — email (exists)
4. ResetPasswordRequest — token, email, password
5. StoreListingRequest — title, category_id, description, price rules, all vehicle fields with conditional validation per category
6. UpdateListingRequest — same but all 'sometimes'
7. SearchRequest — q, filters, sort, pagination with validation
8. StoreMessageRequest — listing_id (exists), body (max:5000)
9. SavedSearchRequest — name, filters (array), email_frequency
10. UpdateSellerProfileRequest — company_name, description, logo, all address fields
11. UploadImagesRequest — images array (max 20, each max 10MB, mimes: jpg/png/webp/heic)
12. RejectListingRequest — reason (required, max:1000)
13. StoreReviewRequest — rating (1-5), title, body
14. FinanceInquiryRequest — amount, term, contact info
15. ContactFormRequest — name, email, subject, message

### Files: 15 files in `app/Http/Requests/`

---

## PHASE 7: API Resources & Response Formatting
**Priority: HIGH | Estimated: 1 day**

JSON API resources for consistent response structure.

### Resources (12+):
1. UserResource — id, name, email, role, avatar, created_at, conditional seller_profile
2. ListingResource — all fields + nested images, category, brand, seller, conditional specs, is_favorited
3. ListingCardResource — lighter version for list views (id, title, slug, price, image, location, year, mileage)
4. ListingImageResource — id, position, all URL sizes
5. CategoryResource — id, name (localized), slug, icon, listing_count, children
6. BrandResource — id, name, slug, logo, conditional models
7. SellerProfileResource — company, slug, location, logo, is_verified, rating, review_count
8. SellerReviewResource — rating, title, body, buyer name, date, seller_response
9. MessageThreadResource — listing basic, other party, last message, unread count
10. MessageResource — sender_id, body, attachments, is_read, timestamps
11. NotificationResource — type, title, body, data, is_read, created_at
12. SearchResultResource — listing data + relevance score + highlights

### Files: 12 files in `app/Http/Resources/`

---

## PHASE 8: Authentication System (Backend)
**Priority: CRITICAL | Estimated: 1 day**

Complete auth API with Sanctum tokens.

### Controllers & Logic:
1. **AuthController**:
   - `register()` — create user, assign role, create Sanctum token, send verification email
   - `login()` — validate credentials, check is_active, create token, update last_login_at
   - `logout()` — revoke current token
   - `user()` — return auth user with seller_profile
   - `forgotPassword()` — send reset link
   - `resetPassword()` — reset password, revoke all tokens
   - `verifyEmail()` — email verification
   - `updateProfile()` — update name, phone, avatar, locale
   - `changePassword()` — validate old password, update
   - `deleteAccount()` — soft delete with confirmation

2. **Middleware**:
   - `EnsureRole` — check user role (admin bypasses all)
   - `SetLocale` — set app locale from user preference or Accept-Language header

### Routes:
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/user
PUT    /auth/user
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email
PUT    /auth/change-password
DELETE /auth/account
```

### Files: 3 files (AuthController, EnsureRole middleware, SetLocale middleware)

---

## PHASE 9: Authentication System (Frontend)
**Priority: CRITICAL | Estimated: 2 days**

Complete auth flow in Nuxt.

### Tasks:
1. `plugins/api.ts` — $api helper with auth token injection, 401 interceptor
2. `composables/useAuth.ts` — login, register, logout, fetchUser, token management in httpOnly cookie
3. `middleware/auth.ts` — redirect unauthenticated to /login
4. `middleware/guest.ts` — redirect authenticated to /
5. `middleware/seller.ts` — check seller/admin role
6. `middleware/admin.ts` — check admin role

### Pages:
7. `pages/login.vue` — email + password form, "Forgot password?" link, social login buttons placeholder, error handling, i18n
8. `pages/register.vue` — name, email, password, confirm password, role selector (Buyer card / Seller card), terms checkbox, i18n
9. `pages/forgot-password.vue` — email input, send reset link
10. `pages/reset-password.vue` — new password form with token from URL

### Layout:
11. `layouts/auth.vue` — centered card layout, MenonTrucks logo, language switcher

### Verification:
- Register new user → get token → redirected to dashboard
- Login → token stored → user loaded
- Protected routes redirect to login
- Logout clears token
- Language preference persists

### Files: 11 files

---

## PHASE 10: Design System & Theme Components
**Priority: CRITICAL | Estimated: 2 days**

All reusable UI components — the design system.

### Common Components:
1. **AppButton.vue** — variants (primary/secondary/outline/danger/ghost), sizes (sm/md/lg), loading state, icon support, disabled state
2. **AppInput.vue** — label, placeholder, error message, icon, types (text/email/password/number/tel), v-model
3. **AppSelect.vue** — dropdown with search, multi-select option, custom option rendering
4. **AppTextarea.vue** — label, error, character count, auto-resize
5. **AppCheckbox.vue** — label, v-model, indeterminate state
6. **AppRadio.vue** — radio group with options
7. **AppToggle.vue** — on/off switch
8. **AppBadge.vue** — variants (success/warning/danger/info/default), sizes
9. **StatusBadge.vue** — listing status specific colors
10. **AppModal.vue** — overlay, sizes (sm/md/lg/xl), close on escape/overlay, teleported
11. **AppDrawer.vue** — slide-in from left/right, for mobile menus and filters
12. **AppToast.vue** — success/error/info notifications
13. **AppDropdown.vue** — trigger + menu, click outside to close
14. **AppTabs.vue** — tab navigation component
15. **AppAccordion.vue** — expandable sections
16. **AppTooltip.vue** — hover tooltip
17. **AppAvatar.vue** — user avatar with fallback initials
18. **AppPagination.vue** — page numbers, prev/next, "Showing X-Y of Z"
19. **AppBreadcrumb.vue** — path trail with links
20. **AppEmptyState.vue** — icon, title, description, action button
21. **AppSkeleton.vue** — loading skeleton (line/circle/rect variants)
22. **AppConfirmDialog.vue** — "Are you sure?" confirmation modal
23. **LanguageSwitcher.vue** — EN/NL/DE flag dropdown
24. **CurrencyDisplay.vue** — formatted price with currency symbol
25. **StarRating.vue** — 1-5 star display/input component

### Files: 25 component files in `components/common/`

---

## PHASE 11: Main Layout — Header, Footer, Navigation
**Priority: CRITICAL | Estimated: 2 days**

The main website shell that wraps all public pages.

### Header (AppHeader.vue):
- **Top bar** (optional): language switcher, "Sell your vehicle" link, phone number
- **Main bar**:
  - Left: MenonTrucks logo (linked to home)
  - Center: Main nav links — Transport, Equipment, Vans, Cars, Containers, Parts
  - Right: Search icon, Favorites (heart with count), Login/Register buttons
  - When logged in: user avatar dropdown (Dashboard, Favorites, Messages, Profile, Logout)
  - Seller badge: "Seller Dashboard" link if seller role
  - Admin badge: "Admin Panel" link if admin role
- **Mobile**: Hamburger → full-screen slide drawer with all nav + auth

### Footer (AppFooter.vue):
- Navy background (#1E2B47)
- 5 columns:
  1. Logo + company description + social icons
  2. Transport: Trucks, Trailers, Tractor Units, Semi Trailers
  3. Equipment: Construction, Agricultural, Forklifts, Material Handling
  4. Company: About, Contact, Careers, Blog, Press
  5. Support: Help Center, Terms, Privacy, Advertise, Sitemap
- Bottom bar: copyright, payment method icons, language selector
- Responsive: stacks to 2 columns tablet, 1 mobile

### Default Layout (layouts/default.vue):
- Header + slot + Footer
- Cookie consent banner at bottom

### Files: 3 files (AppHeader, AppFooter, default layout)

---

## PHASE 12: Homepage — Hero, Categories, Featured
**Priority: HIGH | Estimated: 2 days**

The main landing page — first impression for visitors.

### Sections (top to bottom):
1. **Hero Section**:
   - Full-width navy gradient background with subtle pattern
   - H1: "Europe's Leading Commercial Vehicle Marketplace" (translated)
   - Subtitle: "Search over 150,000 trucks, trailers, and equipment from verified dealers"
   - Search bar: Category dropdown + keyword input + location dropdown + orange SEARCH button
   - Quick links below: "Popular: Mercedes Actros • Volvo FH • Used Trucks NL • DAF XF"

2. **Category Icons Grid** (6-8 main categories):
   - Trucks, Trailers, Construction Equipment, Vans & LCVs, Cars, Containers, Parts
   - Each: icon + name + listing count, clickable to category page
   - Responsive: 4 columns desktop, 3 tablet, 2 mobile

3. **Featured Listings Carousel**:
   - "Featured Listings" heading + "View All" link
   - Horizontal scroll with arrows, 4 visible at a time
   - Uses ListingCard component

4. **Stats Bar**:
   - 4 stats: "150,000+ Listings" | "5,000+ Verified Dealers" | "20+ Countries" | "Since 2024"
   - Navy background, white text, icon for each

5. **Recent Listings Grid**:
   - "Recently Added" heading + "View All" link
   - 4x3 grid (12 listings)
   - Uses ListingCard component

6. **Popular Brands Section**:
   - Brand logos in a grid/carousel: Mercedes, Volvo, Scania, MAN, DAF, Caterpillar, etc.
   - Clickable to brand search results

7. **Why MenonTrucks? (Trust section)**:
   - 3 feature cards:
     - "Verified Dealers" — badge icon, description
     - "Secure Messaging" — chat icon, description
     - "Vehicle History" — document icon, description

8. **Dealer CTA Banner**:
   - "Are you a dealer? List your vehicles today"
   - Orange gradient background, "Register as Seller" button

9. **Recent Blog/News** (placeholder for future):
   - 3 article cards

### Components:
- `components/home/HeroSearch.vue`
- `components/home/CategoryGrid.vue`
- `components/home/FeaturedListings.vue`
- `components/home/StatsSection.vue`
- `components/home/PopularBrands.vue`
- `components/home/TrustSection.vue`
- `components/home/DealerCTA.vue`

### Files: 8 files (1 page + 7 components)

---

## PHASE 13: Vehicle Category System (44 Categories)
**Priority: HIGH | Estimated: 1 day**

Full category tree matching and exceeding TrucksNL.

### Category Tree:
```
TRANSPORT
├── Trucks
│   ├── Tractor Units
│   ├── Box Trucks
│   ├── Flatbed Trucks
│   ├── Tipper Trucks
│   ├── Refrigerated Trucks
│   ├── Crane Trucks
│   ├── Tank Trucks
│   ├── Fire Trucks
│   ├── Garbage Trucks
│   ├── Curtainsider Trucks
│   └── Other Trucks
├── Trailers
│   ├── Semi Trailers
│   ├── Curtainsider Trailers
│   ├── Flatbed Trailers
│   ├── Refrigerated Trailers
│   ├── Tank Trailers
│   ├── Tipper Trailers
│   ├── Container Chassis
│   ├── Lowboy Trailers
│   ├── Walking Floor
│   └── Other Trailers
├── Full Trailers

EQUIPMENT
├── Construction Machinery
│   ├── Excavators
│   ├── Wheel Loaders
│   ├── Bulldozers
│   ├── Cranes
│   ├── Concrete Mixers
│   ├── Compactors
│   └── Other Construction
├── Agricultural Machinery
│   ├── Tractors
│   ├── Harvesters
│   ├── Sprayers
│   └── Other Agricultural
├── Material Handling
│   ├── Forklifts
│   ├── Reach Stackers
│   ├── Telehandlers
│   └── Other Material Handling
├── Forestry & Groundcare

VANS & LCVs
├── Panel Vans
├── Box Vans
├── Refrigerated Vans
├── Pickup Trucks
├── Chassis Cabs
├── Minibuses

CARS
├── Passenger Cars
├── SUVs
├── Campers & Caravans
├── Car Trailers

CONTAINERS
├── Shipping Containers (20ft/40ft)
├── Construction Containers
├── Swap Body Containers
├── Tank Containers
├── Reefer Containers
├── Accommodation Containers
├── Environmental Containers

PARTS & COMPONENTS
├── Truck Parts
│   ├── Engines
│   ├── Transmissions
│   ├── Axles & Suspension
│   ├── Brakes
│   ├── Body Parts
│   ├── Electrical & Electronics
│   └── Hydraulics
├── Van/LCV Parts
├── Tyres & Wheels
```

### Backend:
- CategoryController with tree loading, category-specific filter options
- Category seeder with all 44+ categories, translatable names (EN/NL/DE)

### Frontend:
- Category dropdown in mega-menu style for header
- Category landing pages with subcategory chips

### Files: 2 files (seeder + controller updates)

---

## PHASE 14: Brand & Model Database
**Priority: HIGH | Estimated: 1 day**

Complete brand database with models, linked to categories.

### Brands (30+):
**Trucks/Trailers**: Mercedes-Benz, Volvo, Scania, MAN, DAF, Iveco, Renault Trucks, Kenworth, Peterbilt, Freightliner, Mack, International, Isuzu, Hino, FUSO, Schmitz Cargobull, Krone, Kogel
**Equipment**: Caterpillar, Komatsu, JCB, Liebherr, Volvo CE, John Deere, Case, Hitachi, Kubota, Bobcat
**Vans**: Mercedes, VW, Ford, Renault, Fiat, Iveco, MAN, Opel/Vauxhall, Citroen, Peugeot, Toyota
**Cars**: All major car brands

Each brand with 5-15 models, linked to relevant categories via pivot table.

### Files: 1 seeder file (BrandSeeder)

---

## PHASE 15: Listing CRUD API (Backend)
**Priority: CRITICAL | Estimated: 2 days**

Complete listing management API.

### Public Endpoints:
- `GET /listings` — paginated, filterable (category, brand, price range, year, condition, country, fuel, transmission)
- `GET /listings/{slug}` — full detail with relations, view count increment (IP rate-limited)
- `GET /listings/{slug}/related` — 6 related listings (same category + brand)

### Seller Endpoints:
- `GET /seller/listings` — own listings with stats
- `POST /seller/listings` — create (saved as draft)
- `PUT /seller/listings/{id}` — update (owner check)
- `DELETE /seller/listings/{id}` — soft delete
- `POST /seller/listings/{id}/publish` — change to pending_review
- `POST /seller/listings/{id}/mark-sold` — change to sold
- `POST /seller/listings/{id}/renew` — extend expiry
- `POST /seller/listings/{id}/duplicate` — clone listing

### Image Endpoints:
- `POST /seller/listings/{id}/images` — upload (max 20)
- `DELETE /seller/listings/{id}/images/{imageId}` — delete
- `PUT /seller/listings/{id}/images/reorder` — update positions

### Controllers:
- ListingController (public)
- SellerListingController (seller)
- ListingPolicy (authorization)

### Files: 5 files (2 controllers, 1 policy, 2 requests)

---

## PHASE 16: Image Processing Pipeline
**Priority: HIGH | Estimated: 1 day**

Upload → Process → Store → Serve pipeline.

### Flow:
1. Client validates: max 20 images, 10MB each, jpg/png/webp/heic
2. Upload to Laravel → store temp in S3
3. Dispatch `ProcessListingImages` job (queue)
4. Job uses Intervention Image v3 to generate:
   - Original (max 2400px width)
   - Large (1200px)
   - Medium (600px)
   - Thumbnail (300x225, cropped)
   - WebP version of each size
5. Store all variants in S3: `listings/{id}/{size}_{position}.{ext}`
6. Create ListingImage record with all URLs
7. Frontend uses `<picture>` with WebP + JPEG fallback

### Services:
- ImageProcessingService — resize, crop, WebP convert, S3 upload
- ProcessListingImages job — queue-based processing

### Files: 2 files (service + job)

---

## PHASE 17: Database Seeders (Demo Data)
**Priority: HIGH | Estimated: 1 day**

Realistic demo data for development and testing.

### Seeders:
1. **CategorySeeder** — 44+ categories with translations (EN/NL/DE)
2. **BrandSeeder** — 30+ brands with 200+ models, category pivots
3. **LocationSeeder** — 40+ cities across NL, DE, UK, BE, FR
4. **UserSeeder** — 1 admin + 5 sellers (with profiles) + 5 buyers
5. **ListingSeeder** — 500 demo listings:
   - 150 Trucks (various subcategories, realistic titles/prices)
   - 100 Trailers
   - 80 Vans
   - 70 Equipment
   - 50 Parts
   - 30 Cars
   - 20 Containers
   - Each with 2-5 placeholder images, realistic specs
6. **SubscriptionPlanSeeder** — Free, Basic (EUR29/mo), Pro (EUR79/mo), Enterprise (EUR199/mo)
7. **ListingFactory** — for test data generation

### Files: 8 files in `database/seeders/` + 1 factory

---

## PHASE 18: Listing Card Component
**Priority: HIGH | Estimated: 1 day**

The most reused component — appears everywhere.

### ListingCard.vue:
- Image with aspect-ratio 4:3, lazy loading, hover zoom
- "Featured" badge (orange) top-left if featured
- Condition badge (New=green, Used=gray) top-right
- Heart icon (favorite toggle) on image hover
- Below image:
  - Title (2 lines max, truncate)
  - Price (large, orange, formatted with EUR symbol) or "Price on request"
  - "Negotiable" tag if applicable
  - Key specs row: Year | Mileage (formatted) | Fuel type
  - Location: pin icon + city, country flag
  - Seller name + verified badge
- Entire card links to listing detail page
- Skeleton loading variant

### ListingCardSkeleton.vue:
- Matching dimensions with pulse animation

### ListingCardHorizontal.vue:
- Horizontal variant for list view (image left, info right)

### Files: 3 component files

---

## PHASE 19: Category Landing Pages
**Priority: HIGH | Estimated: 2 days**

When user clicks "Trucks" or "Trailers" — this is what they see.

### /trucks (or /trailers, /equipment, etc.):
- **Category Header**: name, description, listing count, breadcrumb
- **Subcategory Chips**: clickable subcategory pills (Tractor Units, Box Trucks, etc.)
- **Top brands in this category**: brand logos with counts
- **Filter sidebar + Results grid** (same layout as search page)
- SSR for SEO with useAsyncData

### /trucks/tractor-units (subcategory):
- Same layout but scoped to subcategory
- Different subcategory highlighted

### Pages:
- `pages/[category]/index.vue` — handles both parent and child categories
- Dynamic meta tags for SEO

### Files: 1 page + 1 component (CategoryHeader)

---

## PHASE 20: Listing Detail Page
**Priority: CRITICAL | Estimated: 3 days**

The most important page — where buyers decide to contact.

### Layout (two columns):
**Left Column (60%)**:
1. **Image Gallery**: Main image + thumbnails, fullscreen lightbox, swipe on mobile
2. **Quick Specs Bar**: Key specs in pills
3. **Description**: Full text with "Read more" toggle
4. **Specifications Table**: Grouped, alternating rows
5. **Vehicle History** (if available): Inspection report, VIN check, service records
6. **Location Map**: Static map + city/region/country
7. **Related Listings**: 4 cards

**Right Column (40%, sticky)**:
1. **Price Card**: Price in orange, VAT note
2. **Seller Card**: Logo, name, verified badge, rating, response time
3. **Contact Buttons**: Phone, WhatsApp, Message, Request Quote
4. **Actions**: Favorite, Share, Compare, Print, Report
5. **Finance Calculator**: Loan calculator with monthly payment

### Components:
- `ListingGallery.vue`
- `ListingSpecs.vue`
- `ListingContactCard.vue`
- `ListingVehicleHistory.vue`
- `ListingFinanceCalculator.vue`
- `ListingShareMenu.vue`
- `ListingBreadcrumb.vue`
- `ListingRelated.vue`

### Files: 1 page + 8 components

---

## PHASE 21: Elasticsearch Setup & Search API
**Priority: CRITICAL | Estimated: 2 days**

The search engine that powers the marketplace.

### Elasticsearch Index:
- Index: `listings`
- 3 shards, 1 replica
- Custom analyzers: synonym, autocomplete, language (NL/DE)
- Mapping: title, description, brand_name, model_name (text+keyword), all filter fields (keyword), price/year/mileage (numeric), location (geo_point)

### ElasticsearchService:
- `createIndex()` / `deleteIndex()`
- `indexListing(Listing)` / `removeListing(int)`
- `search(params)` — bool query with must/filter/aggregations/sort/pagination
- `suggest(query)` — autocomplete suggestions
- `bulkIndex(Collection)` — batch indexing

### Aggregations: brands, categories, fuel_types, conditions, price_ranges, year_ranges, countries

### Sync: Jobs for index/remove, artisan command for full reindex

### Files: 4 files (2 services + 1 command + 1 controller)

---

## PHASE 22: Search Results Page (Frontend)
**Priority: CRITICAL | Estimated: 3 days**

The most complex frontend page.

### Layout:
- Desktop: Filter sidebar (280px) + Results grid
- Mobile: Floating "Filters" button → slide-out drawer

### Filters: Category tree, Brand (searchable), Model, Price/Year/Mileage ranges, Condition, Fuel, Transmission, Country, Emission

### Results: Count, Grid/List toggle, Sort dropdown, Active filter chips, Pagination

### Files: 1 page + 5 components + 1 composable

---

## PHASE 23: Favorites & Recently Viewed
**Priority: MEDIUM | Estimated: 1 day**

### Favorites: Backend CRUD + frontend composable + page
### Recently Viewed: Middleware tracking + page
### Comparison Tool: Side-by-side spec comparison (max 4)

### Files: 3 pages + 1 composable + 2 controllers

---

## PHASE 24: Messaging System (Backend + Real-time)
**Priority: HIGH | Estimated: 2 days**

### Backend: MessageController with threads, send, markRead, archive
### Real-time: Laravel Reverb WebSockets, private channels
### Frontend: Two-column messages page, chat bubbles, typing indicator

### Files: 1 controller + 1 event + 1 page + 1 composable

---

## PHASE 25: Notification System
**Priority: MEDIUM | Estimated: 1 day**

### Types: New message, listing approved/rejected, new review, saved search alert, subscription expiring
### Backend: NotificationController, Reverb broadcast
### Frontend: Bell icon with badge, dropdown, full page, toast popup

### Files: 1 controller + 1 page + 2 components

---

## PHASE 26: Seller Dashboard
**Priority: HIGH | Estimated: 3 days**

### Layout: Fixed left sidebar (navy) + top bar + content
### Pages:
1. Dashboard — stats cards, views chart, recent messages
2. Manage Listings — status tabs, table, bulk actions
3. Create Listing — 7-step multi-step form
4. Edit Listing — pre-populated form
5. Messages — (shared with Phase 24)
6. Reviews — received reviews with respond option
7. Company Profile — logo, banner, description, address
8. Subscription — current plan, usage, upgrade/downgrade
9. Analytics — charts, top listings, date range

### Files: 1 layout + 9 pages + sub-components

---

## PHASE 27: Seller Public Profile Page
**Priority: MEDIUM | Estimated: 1 day**

### `/sellers/{slug}`:
- Header banner, profile card, contact bar
- Tabs: Listings, About, Reviews
- Stats: total listings, views, years active

### Files: 1 page + 1 component

---

## PHASE 28: Seller Reviews & Trust System
**Priority: MEDIUM | Estimated: 2 days**

### Backend: SellerReviewController, one review per buyer per seller
### Trust Score: Verified identity, response rate, rating, account age, completed listings
### Frontend: Star rating input, review form, review list

### Files: 1 controller + 1 request + 2 components

---

## PHASE 29: Admin Panel
**Priority: HIGH | Estimated: 3 days**

### Layout: Dark navy sidebar with admin nav
### Pages:
1. Dashboard — stats, charts, pending queue
2. Listing Moderation — approve/reject with reason
3. User Management — roles, activate/ban/impersonate
4. Categories — tree view, drag-to-reorder, CRUD
5. Brands — CRUD with models
6. Review Moderation
7. Banner Ads — CRUD with performance stats
8. CMS Pages — rich text editor, multi-language
9. Analytics — listings, users, revenue, search queries
10. Settings — site config, commission rates, maintenance mode

### Files: 1 layout + 10 pages + admin components

---

## PHASE 30: Monetization — Subscriptions & Featured Listings
**Priority: HIGH | Estimated: 2 days**

### Plans: Free, Basic (EUR29.99/mo), Professional (EUR79.99/mo), Enterprise (EUR199.99/mo)
### Backend: Laravel Cashier + Stripe, webhooks, listing limits
### Featured: Placements (homepage/category/search), 7/14/30 day durations
### Frontend: Pricing page, subscription management, "Boost listing" button

### Files: 2 controllers + 1 page + 2 components

---

## PHASE 31: Vehicle History & Inspection Reports
**Priority: MEDIUM | Estimated: 2 days**

### Vehicle History: VIN check, accident/owner/service data
### Inspections: Inspector details, A-F rating, PDF upload, checklist
### Frontend: VehicleHistoryCard, InspectionBadge components

### Files: 2 controllers + 2 components + 2 models

---

## PHASE 32: Finance Calculator & Insurance
**Priority: MEDIUM | Estimated: 1 day**

### Calculator: Price, down payment, term, interest rate → monthly payment
### Insurance: Quote request form (placeholder for API integration)

### Files: 1 component + 1 controller + 1 model

---

## PHASE 33: Saved Searches & Email Alerts
**Priority: MEDIUM | Estimated: 1 day**

### Backend: CRUD + scheduled command for daily/weekly email alerts
### Frontend: "Save this search" button, saved searches page

### Files: 1 controller + 1 command + 1 job + 1 page

---

## PHASE 34: SEO & Performance Optimization
**Priority: HIGH | Estimated: 2 days**

### SEO: SSR, meta tags, JSON-LD, canonical URLs, sitemap.xml, robots.txt, hreflang
### Performance: Redis caching, eager loading, WebP images, API caching, database indexes

### Files: Sitemap command, meta composable, robots.txt, various optimizations

---

## PHASE 35: Static Pages, Contact Form & Final Polish
**Priority: MEDIUM | Estimated: 2 days**

### Pages: About, Contact, Terms, Privacy, FAQ, Pricing, How It Works
### Backend: ContactController with rate limiting
### Polish: Cookie consent, 404/500 pages, loading states, responsive audit

### Files: 7 pages + 1 controller + error pages

---

# EXECUTION ORDER SUMMARY

| # | Phase | Priority | Dependencies |
|---|-------|----------|-------------|
| 1 | Docker Infrastructure | CRITICAL | None |
| 2 | Laravel Backend Init | CRITICAL | Phase 1 |
| 3 | Nuxt Frontend Init | CRITICAL | Phase 1 |
| 4 | Database Migrations | CRITICAL | Phase 2 |
| 5 | Eloquent Models | CRITICAL | Phase 4 |
| 6 | Requests & Validation | HIGH | Phase 5 |
| 7 | API Resources | HIGH | Phase 5 |
| 8 | Auth Backend | CRITICAL | Phase 5,6 |
| 9 | Auth Frontend | CRITICAL | Phase 3,8 |
| 10 | Design System Components | CRITICAL | Phase 3 |
| 11 | Layout (Header/Footer) | CRITICAL | Phase 10 |
| 12 | Homepage | HIGH | Phase 11 |
| 13 | Category System | HIGH | Phase 5 |
| 14 | Brand Database | HIGH | Phase 13 |
| 15 | Listing CRUD API | CRITICAL | Phase 5,6 |
| 16 | Image Pipeline | HIGH | Phase 15 |
| 17 | Database Seeders | HIGH | Phase 5,13,14 |
| 18 | Listing Card Component | HIGH | Phase 10 |
| 19 | Category Landing Pages | HIGH | Phase 13,18 |
| 20 | Listing Detail Page | CRITICAL | Phase 15,18 |
| 21 | Elasticsearch Setup | CRITICAL | Phase 15 |
| 22 | Search Results Page | CRITICAL | Phase 21,18 |
| 23 | Favorites & Compare | MEDIUM | Phase 9,18 |
| 24 | Messaging System | HIGH | Phase 8,9 |
| 25 | Notifications | MEDIUM | Phase 24 |
| 26 | Seller Dashboard | HIGH | Phase 15,16 |
| 27 | Seller Public Profile | MEDIUM | Phase 26 |
| 28 | Reviews & Trust | MEDIUM | Phase 27 |
| 29 | Admin Panel | HIGH | Phase 15,8 |
| 30 | Monetization (Stripe) | HIGH | Phase 26 |
| 31 | Vehicle History | MEDIUM | Phase 20 |
| 32 | Finance Calculator | MEDIUM | Phase 20 |
| 33 | Saved Searches | MEDIUM | Phase 22 |
| 34 | SEO & Performance | HIGH | Phase 20,22 |
| 35 | Static Pages & Polish | MEDIUM | Phase 11 |

---

# TOTAL ESTIMATED FILES: ~250+
# TOTAL ESTIMATED CODE: ~30,000+ lines
# TOTAL TABLES: 30
# TOTAL API ENDPOINTS: 70+
# TOTAL FRONTEND PAGES: 35+
# TOTAL COMPONENTS: 60+

---

## Verification Checklist
After all phases complete:
- [ ] `docker compose up` starts all services
- [ ] `make fresh` migrates, seeds 500 listings, indexes in Elasticsearch
- [ ] Homepage loads with featured listings, categories, stats
- [ ] Search returns results with working filters and aggregations
- [ ] Auth flow: register → login → logout → forgot password
- [ ] Seller can: create listing (7 steps) → upload images → publish → mark sold
- [ ] Buyer can: search → view detail → contact seller → add favorite → compare
- [ ] Real-time: send message → other party sees it instantly
- [ ] Admin can: approve/reject listings → manage users → manage categories
- [ ] Subscription flow: view plans → subscribe via Stripe → listing limit enforced
- [ ] 3 languages work: EN/NL/DE with switcher
- [ ] Mobile responsive on all pages
- [ ] Lighthouse score > 90 for public pages
- [ ] All 44 categories populated with correct hierarchy
