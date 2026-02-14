import prisma from "@/config/database";
import { authService } from "@/services/auth.service";

// ---------------------------------------------------------------------------
// Demo Data Seeder
// ---------------------------------------------------------------------------
// Creates realistic demo data for development and testing.
// Run with: npx ts-node -r tsconfig-paths/register src/seeders/demo.seeder.ts
// ---------------------------------------------------------------------------

// ---- Utility helpers ----

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Data pools ----

const EUROPEAN_COUNTRIES = ["DE", "NL", "BE", "FR", "PL", "AT", "IT", "ES", "CZ", "DK"];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Dusseldorf", "Stuttgart", "Cologne"],
  NL: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague", "Eindhoven"],
  BE: ["Brussels", "Antwerp", "Ghent", "Bruges"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse", "Strasbourg"],
  PL: ["Warsaw", "Krakow", "Wroclaw", "Gdansk", "Poznan"],
  AT: ["Vienna", "Graz", "Salzburg", "Linz"],
  IT: ["Milan", "Rome", "Turin", "Bologna"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville"],
  CZ: ["Prague", "Brno", "Ostrava"],
  DK: ["Copenhagen", "Aarhus", "Odense"],
};

const TRUCK_BRANDS = [
  { name: "MAN", slug: "man" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Volvo", slug: "volvo" },
  { name: "Scania", slug: "scania" },
  { name: "DAF", slug: "daf" },
  { name: "Iveco", slug: "iveco" },
  { name: "Renault Trucks", slug: "renault-trucks" },
  { name: "Krone", slug: "krone" },
  { name: "Schmitz Cargobull", slug: "schmitz-cargobull" },
  { name: "Caterpillar", slug: "caterpillar" },
];

const TRUCK_MODELS: Record<string, string[]> = {
  man: ["TGX 18.510", "TGX 26.510", "TGS 18.470", "TGS 26.470", "TGL 12.250", "TGM 18.340"],
  "mercedes-benz": ["Actros 1845", "Actros 2545", "Arocs 3340", "Atego 1230", "Sprinter 316", "Econic 2630"],
  volvo: ["FH 500", "FH 460", "FM 420", "FMX 500", "FL 250", "FE 320"],
  scania: ["R 450", "R 500", "S 530", "G 410", "P 320", "L 280"],
  daf: ["XF 480", "XG+ 530", "CF 340", "LF 230", "XD 450"],
  iveco: ["S-Way 480", "Eurocargo 160E30", "Daily 35S16", "T-Way 480", "X-Way 480"],
  "renault-trucks": ["T 480", "T High 520", "C 430", "D 16", "D Wide 280"],
  krone: ["Profi Liner", "Cool Liner", "Dry Liner", "Box Liner", "Mega Liner"],
  "schmitz-cargobull": ["S.CS Curtainsider", "S.KO Dry Freight", "S.KI Tipper", "S.CF Reefer"],
  caterpillar: ["745 Articulated Truck", "772G Off-Highway", "CT660 Vocational", "CT681"],
};

const CATEGORIES = [
  {
    name: { en: "Trucks", de: "LKW", fr: "Camions" },
    slug: "trucks",
    icon: "truck",
    description: { en: "All types of trucks and lorries", de: "Alle Arten von LKW", fr: "Tous types de camions" },
  },
  {
    name: { en: "Trailers", de: "Auflieger", fr: "Remorques" },
    slug: "trailers",
    icon: "trailer",
    description: { en: "Semi-trailers, flatbeds, and more", de: "Auflieger, Pritschen und mehr", fr: "Semi-remorques, plateaux et plus" },
  },
  {
    name: { en: "Construction Equipment", de: "Baumaschinen", fr: "Engins de chantier" },
    slug: "construction-equipment",
    icon: "hard-hat",
    description: { en: "Excavators, loaders, and heavy equipment", de: "Bagger, Lader und schwere Maschinen", fr: "Pelles, chargeuses et engins lourds" },
  },
  {
    name: { en: "Vans", de: "Transporter", fr: "Utilitaires" },
    slug: "vans",
    icon: "van",
    description: { en: "Light commercial vehicles and vans", de: "Leichte Nutzfahrzeuge und Transporter", fr: "Vehicules utilitaires legers" },
  },
];

const TRUCK_TITLES = [
  "TGX 18.510 4x2 BLS Tractor Unit",
  "Actros 1845 LS StreamSpace",
  "FH 500 Globetrotter XL 4x2",
  "R 450 Highline 4x2",
  "XF 480 Super Space Cab",
  "S-Way AS440S48 Highway Tractor",
  "T 480 High Sleeper Cab",
  "TGS 26.470 6x4 Tipper",
  "Arocs 3340 6x4 Tipper",
  "FMX 500 8x4 Heavy Haulage",
  "R 500 V8 Topline 6x2",
  "XG+ 530 FTG 4x2",
  "TGL 12.250 BL Box Truck",
  "Atego 1230 L Refrigerated",
  "FL 250 4x2 Distribution",
  "P 320 B6x2 Rigid",
  "CF 340 FA 6x2 Chassis",
  "Eurocargo 160E30 Flatbed",
  "TGM 18.340 4x2 BL Curtainsider",
  "Actros 2545 6x2 Curtainsider",
  "FH 460 6x2 Tractor Unit",
  "S 530 V8 Next Generation",
  "XF 480 FTG 6x2 Mega",
  "G 410 A6x2/4 Rigid",
  "TGX 26.510 6x2 BLS Container",
];

const TRAILER_TITLES = [
  "Profi Liner Curtainsider Semi-trailer",
  "S.CS Curtainsider Mega",
  "Cool Liner Reefer Trailer",
  "S.KO Dry Freight Box Semi",
  "Dry Liner Standard Box",
  "S.CF Reefer Thermo King",
  "Mega Liner Coil Transport",
  "S.KI Steel Tipper Semi",
  "Box Liner Plywood",
  "Profi Liner Coil Trough",
  "3-Axle Flatbed Semi-trailer",
  "Lowbed Semi-trailer 4-Axle",
  "Container Chassis 40ft",
  "Curtainsider Mega 3-Axle",
  "Tipper Semi-trailer Aluminium",
];

const EQUIPMENT_TITLES = [
  "745 Articulated Dump Truck",
  "320 Hydraulic Excavator",
  "950M Wheel Loader",
  "D6T Track-Type Tractor",
  "140M Motor Grader",
  "730C2 EJ Ejector Truck",
  "336 GC Excavator",
  "966M XE Wheel Loader",
  "R 946 Crawler Excavator",
  "L 566 XPower Wheel Loader",
];

const VAN_TITLES = [
  "Sprinter 316 CDI L2H2",
  "Daily 35S16 A8 Panel Van",
  "Crafter 2.0 TDI L3H3",
  "Transit 2.0 EcoBlue L4H3",
  "Master 2.3 dCi L3H2",
  "Boxer 2.2 BlueHDi L3H2",
  "Ducato 2.3 MJT L4H3",
  "TGE 3.180 L4H3",
  "Sprinter 516 CDI L3 Chassis",
  "Daily 50C18 Flatbed",
];

const SELLER_COMPANIES = [
  {
    name: "TruckCenter Germany GmbH",
    city: "Hamburg",
    country: "DE",
    website: "https://truckcenter-germany.de",
    description: "Leading commercial vehicle dealer in Northern Germany with over 500 vehicles in stock.",
  },
  {
    name: "Van der Berg Trucks B.V.",
    city: "Rotterdam",
    country: "NL",
    website: "https://vandenbergtrucks.nl",
    description: "Family-owned truck dealership since 1985. Specializing in Volvo and Scania trucks.",
  },
  {
    name: "EuroTrailer Solutions S.A.",
    city: "Brussels",
    country: "BE",
    website: "https://eurotrailer.be",
    description: "Belgium's premier trailer specialist. New and used trailers from all major brands.",
  },
  {
    name: "Polski Transport Sp. z o.o.",
    city: "Warsaw",
    country: "PL",
    website: "https://polskitransport.pl",
    description: "Central European truck marketplace with competitive pricing on used commercial vehicles.",
  },
  {
    name: "Alpine Trucks & Equipment AG",
    city: "Vienna",
    country: "AT",
    website: "https://alpine-trucks.at",
    description: "Premium pre-owned trucks and construction equipment for the Alpine region.",
  },
];

const NOTIFICATION_TYPES = [
  { type: "LISTING_APPROVED", title: "Listing approved", body: "Your listing has been approved and is now live." },
  { type: "NEW_MESSAGE", title: "New message received", body: "You have a new message from a potential buyer." },
  { type: "LISTING_EXPIRING", title: "Listing expiring soon", body: "Your listing will expire in 7 days." },
  { type: "FAVORITE_PRICE_DROP", title: "Price drop alert", body: "A vehicle in your favorites has reduced its price." },
  { type: "NEW_REVIEW", title: "New review received", body: "A buyer has left a review on your profile." },
  { type: "SUBSCRIPTION_EXPIRING", title: "Subscription expiring", body: "Your subscription will expire in 3 days." },
  { type: "WELCOME", title: "Welcome to MenonTrucks", body: "Thank you for joining the largest truck marketplace in Europe." },
  { type: "LISTING_SOLD", title: "Listing marked as sold", body: "Congratulations! Your listing has been marked as sold." },
];

// ---- Main seeder function ----

async function seed() {
  console.log("Starting demo data seeder...\n");

  // ================================================================
  // 1. Clean existing data (in reverse dependency order)
  // ================================================================
  console.log("Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.listingComparison.deleteMany();
  await prisma.featuredListing.deleteMany();
  await prisma.listingSpecification.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.sellerReview.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.specificationKey.deleteMany();
  await prisma.brandModel.deleteMany();
  await prisma.brandCategory.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.page.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.bannerAd.deleteMany();
  await prisma.bulkImport.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("  Done.\n");

  // ================================================================
  // 2. Create categories
  // ================================================================
  console.log("Creating categories...");
  const categoryRecords = [];
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const record = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      },
    });
    categoryRecords.push(record);
  }
  console.log(`  Created ${categoryRecords.length} categories.\n`);

  // ================================================================
  // 3. Create brands and brand models
  // ================================================================
  console.log("Creating brands...");
  const brandRecords = [];
  for (const b of TRUCK_BRANDS) {
    const brand = await prisma.brand.create({
      data: {
        name: b.name,
        slug: b.slug,
        isActive: true,
      },
    });
    brandRecords.push(brand);

    // Link brand to relevant categories
    const relevantCategories =
      ["krone", "schmitz-cargobull"].includes(b.slug)
        ? categoryRecords.filter((c) => c.slug === "trailers")
        : b.slug === "caterpillar"
          ? categoryRecords.filter((c) => c.slug === "construction-equipment")
          : categoryRecords.filter((c) => ["trucks", "vans"].includes(c.slug));

    for (const cat of relevantCategories) {
      await prisma.brandCategory.create({
        data: { brandId: brand.id, categoryId: cat.id },
      });
    }

    // Create brand models
    const models = TRUCK_MODELS[b.slug] || [];
    for (const modelName of models) {
      await prisma.brandModel.create({
        data: {
          brandId: brand.id,
          name: modelName,
          slug: slugify(modelName),
          isActive: true,
        },
      });
    }
  }
  console.log(`  Created ${brandRecords.length} brands with models.\n`);

  // ================================================================
  // 4. Create admin user
  // ================================================================
  console.log("Creating admin user...");
  const adminHash = await authService.hashPassword("Admin123!");
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@menontrucks.com",
      passwordHash: adminHash,
      role: "ADMIN",
      isActive: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });
  console.log(`  Admin: admin@menontrucks.com / Admin123!\n`);

  // ================================================================
  // 5. Create seller users with profiles
  // ================================================================
  console.log("Creating sellers...");
  const sellerPassword = await authService.hashPassword("Seller123!");
  const sellerUsers = [];
  const sellerProfiles = [];

  for (let i = 0; i < SELLER_COMPANIES.length; i++) {
    const company = SELLER_COMPANIES[i];
    const email = `seller${i + 1}@menontrucks.com`;
    const user = await prisma.user.create({
      data: {
        name: company.name,
        email,
        passwordHash: sellerPassword,
        role: "SELLER",
        phone: `+49 ${randomInt(100, 999)} ${randomInt(1000000, 9999999)}`,
        whatsapp: `+49 ${randomInt(100, 999)} ${randomInt(1000000, 9999999)}`,
        isActive: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000),
      },
    });
    sellerUsers.push(user);

    const profile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        companyName: company.name,
        slug: slugify(company.name) + "-" + user.id.slice(0, 8),
        description: company.description,
        website: company.website,
        city: company.city,
        countryCode: company.country,
        isVerified: i < 3,
        verifiedAt: i < 3 ? new Date() : null,
        responseRate: randomFloat(70, 99),
        avgResponseTime: randomInt(1, 24),
        rating: randomFloat(3.5, 5.0, 1),
        reviewCount: randomInt(5, 50),
      },
    });
    sellerProfiles.push(profile);
    console.log(`  Seller ${i + 1}: ${email} / Seller123! — ${company.name}`);
  }
  console.log("");

  // ================================================================
  // 6. Create buyer users
  // ================================================================
  console.log("Creating buyers...");
  const buyerPassword = await authService.hashPassword("Buyer123!");
  const buyerUsers = [];
  const buyerNames = [
    "Hans Mueller",
    "Jean Dupont",
    "Jan Kowalski",
    "Marco Rossi",
    "Carlos Garcia",
  ];

  for (let i = 0; i < buyerNames.length; i++) {
    const email = `buyer${i + 1}@menontrucks.com`;
    const user = await prisma.user.create({
      data: {
        name: buyerNames[i],
        email,
        passwordHash: buyerPassword,
        role: "BUYER",
        phone: `+49 ${randomInt(100, 999)} ${randomInt(1000000, 9999999)}`,
        isActive: true,
        emailVerifiedAt: i < 3 ? new Date() : null,
        lastLoginAt: new Date(Date.now() - randomInt(0, 14) * 24 * 60 * 60 * 1000),
      },
    });
    buyerUsers.push(user);
    console.log(`  Buyer ${i + 1}: ${email} / Buyer123! — ${buyerNames[i]}`);
  }
  console.log("");

  // ================================================================
  // 7. Create subscription plans
  // ================================================================
  console.log("Creating subscription plans...");
  const plans = [
    {
      name: "Free",
      slug: "free",
      description: "Perfect for individuals looking to list a few vehicles",
      priceMonthly: 0,
      priceYearly: 0,
      maxListings: 3,
      maxImages: 5,
      features: [
        "Up to 3 active listings",
        "5 images per listing",
        "Basic search visibility",
        "Contact form",
      ],
      sortOrder: 0,
    },
    {
      name: "Basic",
      slug: "basic",
      description: "Great for small dealers getting started",
      priceMonthly: 29.99,
      priceYearly: 299.99,
      maxListings: 20,
      maxImages: 15,
      features: [
        "Up to 20 active listings",
        "15 images per listing",
        "Enhanced search visibility",
        "Contact form & direct messaging",
        "Basic analytics",
        "Email support",
      ],
      sortOrder: 1,
    },
    {
      name: "Pro",
      slug: "pro",
      description: "Ideal for established dealers with a large inventory",
      priceMonthly: 79.99,
      priceYearly: 799.99,
      maxListings: 100,
      maxImages: 30,
      features: [
        "Up to 100 active listings",
        "30 images per listing",
        "Priority search placement",
        "Contact form, messaging & WhatsApp",
        "Advanced analytics & reports",
        "Featured listing credits (5/month)",
        "Seller profile badge",
        "Priority email & phone support",
      ],
      sortOrder: 2,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Unlimited power for large dealership groups",
      priceMonthly: 199.99,
      priceYearly: 1999.99,
      maxListings: -1,
      maxImages: 50,
      features: [
        "Unlimited active listings",
        "50 images per listing",
        "Top search placement",
        "All contact channels",
        "Full analytics suite with exports",
        "Featured listing credits (20/month)",
        "Verified dealer badge",
        "Bulk import via CSV/API",
        "Dedicated account manager",
        "Custom branding on profile",
      ],
      sortOrder: 3,
    },
  ];

  const planRecords = [];
  for (const p of plans) {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceMonthly: p.priceMonthly,
        priceYearly: p.priceYearly,
        maxListings: p.maxListings,
        maxImages: p.maxImages,
        features: p.features,
        sortOrder: p.sortOrder,
        isActive: true,
      },
    });
    planRecords.push(plan);
  }
  console.log(`  Created ${planRecords.length} subscription plans.\n`);

  // Assign subscriptions to sellers
  for (let i = 0; i < sellerUsers.length; i++) {
    const planIndex = i === 0 ? 3 : i < 3 ? 2 : 1; // First seller = enterprise, next 2 = pro, rest = basic
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + randomInt(1, 12));

    await prisma.userSubscription.create({
      data: {
        userId: sellerUsers[i].id,
        planId: planRecords[planIndex].id,
        status: "ACTIVE",
        periodStart: new Date(now.getTime() - randomInt(30, 180) * 24 * 60 * 60 * 1000),
        periodEnd,
      },
    });
  }
  console.log("  Assigned subscriptions to sellers.\n");

  // ================================================================
  // 8. Create 200 demo listings
  // ================================================================
  console.log("Creating 200 demo listings...");

  const fuelTypes = ["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "LPG", "CNG"] as const;
  const transmissions = ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"] as const;
  const conditions = ["NEW", "USED", "REFURBISHED"] as const;
  const emissionClasses = ["EURO3", "EURO4", "EURO5", "EURO6", "EURO6D"] as const;
  const statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "DRAFT", "SOLD"] as const;

  const listingRecords = [];
  let listingCounter = 0;

  for (let i = 0; i < 200; i++) {
    listingCounter++;
    const category = randomItem(categoryRecords);
    const seller = randomItem(sellerUsers);
    const country = randomItem(EUROPEAN_COUNTRIES);
    const city = randomItem(CITIES_BY_COUNTRY[country] || ["Unknown"]);

    // Pick appropriate title and brand based on category
    let title: string;
    let applicableBrands: typeof brandRecords;

    if (category.slug === "trucks") {
      title = randomItem(TRUCK_TITLES);
      applicableBrands = brandRecords.filter(
        (b) => !["krone", "schmitz-cargobull", "caterpillar"].includes(b.slug)
      );
    } else if (category.slug === "trailers") {
      title = randomItem(TRAILER_TITLES);
      applicableBrands = brandRecords.filter((b) =>
        ["krone", "schmitz-cargobull"].includes(b.slug)
      );
    } else if (category.slug === "construction-equipment") {
      title = randomItem(EQUIPMENT_TITLES);
      applicableBrands = brandRecords.filter((b) => b.slug === "caterpillar");
    } else {
      title = randomItem(VAN_TITLES);
      applicableBrands = brandRecords.filter(
        (b) => !["krone", "schmitz-cargobull", "caterpillar"].includes(b.slug)
      );
    }

    const brand = applicableBrands.length > 0 ? randomItem(applicableBrands) : null;
    const condition = randomItem([...conditions]);
    const status = randomItem([...statuses]);
    const year = randomInt(2015, 2024);
    const mileageKm = condition === "NEW" ? 0 : randomInt(10000, 800000);
    const fuelType = category.slug === "trailers" ? null : randomItem([...fuelTypes]);
    const transmission = category.slug === "trailers" ? null : randomItem([...transmissions]);
    const emissionClass =
      category.slug === "trailers" ? null : randomItem([...emissionClasses]);

    // Price ranges by category
    let priceMin: number, priceMax: number;
    if (category.slug === "trucks") {
      priceMin = 15000;
      priceMax = 180000;
    } else if (category.slug === "trailers") {
      priceMin = 5000;
      priceMax = 60000;
    } else if (category.slug === "construction-equipment") {
      priceMin = 25000;
      priceMax = 350000;
    } else {
      priceMin = 8000;
      priceMax = 65000;
    }

    const price = randomInt(priceMin, priceMax);
    const slug = slugify(`${title}-${year}-${listingCounter}`);

    const publishedAt =
      status === "ACTIVE" || status === "SOLD"
        ? new Date(Date.now() - randomInt(1, 120) * 24 * 60 * 60 * 1000)
        : null;

    const soldAt =
      status === "SOLD"
        ? new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000)
        : null;

    const powerHp =
      category.slug === "trailers" ? null : randomInt(130, 530);
    const powerKw = powerHp ? Math.round(powerHp * 0.7457) : null;

    const listing = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        categoryId: category.id,
        brandId: brand?.id || null,
        title,
        slug,
        description: `${condition === "NEW" ? "Brand new" : "Well-maintained"} ${year} ${brand?.name || ""} ${title}. ${
          mileageKm > 0 ? `Only ${mileageKm.toLocaleString()} km.` : ""
        } Available for immediate delivery from ${city}, ${country}. Full service history available. Contact us for more details and to arrange a viewing.`,
        price,
        priceCurrency: "EUR",
        priceNegotiable: Math.random() > 0.5,
        condition,
        status,
        year,
        mileageKm,
        operatingHours:
          category.slug === "construction-equipment"
            ? randomInt(500, 15000)
            : null,
        fuelType,
        transmission,
        powerHp,
        powerKw,
        emissionClass,
        axleCount:
          category.slug === "trucks"
            ? randomItem([2, 3, 4])
            : category.slug === "trailers"
              ? randomItem([2, 3])
              : null,
        gvwKg:
          category.slug === "trucks"
            ? randomInt(7500, 44000)
            : category.slug === "trailers"
              ? randomInt(20000, 40000)
              : null,
        countryCode: country,
        city,
        contactPhone: `+49 ${randomInt(100, 999)} ${randomInt(1000000, 9999999)}`,
        contactEmail: seller.email,
        viewCount: randomInt(0, 5000),
        favoriteCount: randomInt(0, 50),
        contactCount: randomInt(0, 100),
        isFeatured: Math.random() > 0.85,
        publishedAt,
        soldAt,
        createdAt: new Date(
          Date.now() - randomInt(1, 180) * 24 * 60 * 60 * 1000
        ),
      },
    });

    listingRecords.push(listing);

    // Create 1-3 placeholder images per listing
    const imageCount = randomInt(1, 3);
    for (let j = 0; j < imageCount; j++) {
      await prisma.listingImage.create({
        data: {
          listingId: listing.id,
          position: j,
          originalUrl: `/placeholder/${category.slug}-${(i % 10) + 1}.jpg`,
          thumbnailUrl: `/placeholder/${category.slug}-${(i % 10) + 1}-thumb.jpg`,
          mediumUrl: `/placeholder/${category.slug}-${(i % 10) + 1}-medium.jpg`,
          largeUrl: `/placeholder/${category.slug}-${(i % 10) + 1}-large.jpg`,
          altText: `${title} - Image ${j + 1}`,
        },
      });
    }

    // Update listing imageCount
    await prisma.listing.update({
      where: { id: listing.id },
      data: { imageCount },
    });
  }
  console.log(`  Created ${listingRecords.length} listings with images.\n`);

  // Update category listing counts
  for (const cat of categoryRecords) {
    const count = await prisma.listing.count({
      where: { categoryId: cat.id, status: "ACTIVE", deletedAt: null },
    });
    await prisma.category.update({
      where: { id: cat.id },
      data: { listingCount: count },
    });
  }
  console.log("  Updated category listing counts.\n");

  // ================================================================
  // 9. Create 30 favorites
  // ================================================================
  console.log("Creating favorites...");
  const activeListings = listingRecords.filter((l) => l.status === "ACTIVE");
  const favoriteSet = new Set<string>();
  let favoritesCreated = 0;

  while (favoritesCreated < 30 && activeListings.length > 0) {
    const buyer = randomItem(buyerUsers);
    const listing = randomItem(activeListings);
    const key = `${buyer.id}-${listing.id}`;

    if (!favoriteSet.has(key)) {
      favoriteSet.add(key);
      await prisma.favorite.create({
        data: {
          userId: buyer.id,
          listingId: listing.id,
        },
      });
      favoritesCreated++;
    }
  }
  console.log(`  Created ${favoritesCreated} favorites.\n`);

  // ================================================================
  // 10. Create 10 message threads with 2-3 messages each
  // ================================================================
  console.log("Creating message threads...");
  const threadSet = new Set<string>();
  let threadsCreated = 0;

  while (threadsCreated < 10 && activeListings.length > 0) {
    const buyer = randomItem(buyerUsers);
    const listing = randomItem(activeListings);
    const seller = sellerUsers.find((s) => s.id === listing.sellerId);
    if (!seller) continue;

    const key = `${listing.id}-${buyer.id}-${seller.id}`;
    if (threadSet.has(key)) continue;
    threadSet.add(key);

    const threadDate = new Date(
      Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000
    );

    const thread = await prisma.messageThread.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        sellerId: seller.id,
        lastMessageAt: threadDate,
      },
    });

    const messageCount = randomInt(2, 3);
    const messageTemplates = [
      {
        sender: buyer.id,
        body: `Hi, I'm interested in your ${listing.title}. Is it still available? What is the current condition?`,
      },
      {
        sender: seller.id,
        body: `Hello! Yes, this vehicle is still available. It's in excellent condition with full service history. Would you like to schedule a viewing?`,
      },
      {
        sender: buyer.id,
        body: `That sounds great. Can you tell me more about the payment options? Also, do you offer delivery to my location?`,
      },
    ];

    for (let m = 0; m < messageCount; m++) {
      const template = messageTemplates[m];
      const msgDate = new Date(threadDate.getTime() + m * 3600000);

      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderId: template.sender,
          body: template.body,
          isRead: m < messageCount - 1,
          readAt: m < messageCount - 1 ? new Date(msgDate.getTime() + 1800000) : null,
          createdAt: msgDate,
        },
      });
    }

    // Update thread lastMessageAt
    await prisma.messageThread.update({
      where: { id: thread.id },
      data: {
        lastMessageAt: new Date(
          threadDate.getTime() + (messageCount - 1) * 3600000
        ),
      },
    });

    threadsCreated++;
  }
  console.log(`  Created ${threadsCreated} message threads.\n`);

  // ================================================================
  // 11. Create 20 notifications
  // ================================================================
  console.log("Creating notifications...");
  const allUsers = [adminUser, ...sellerUsers, ...buyerUsers];
  let notificationsCreated = 0;

  for (let i = 0; i < 20; i++) {
    const user = randomItem(allUsers);
    const template = randomItem(NOTIFICATION_TYPES);

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: template.type,
        title: template.title,
        body: template.body,
        isRead: Math.random() > 0.6,
        readAt: Math.random() > 0.6 ? new Date() : null,
        createdAt: new Date(
          Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000
        ),
      },
    });
    notificationsCreated++;
  }
  console.log(`  Created ${notificationsCreated} notifications.\n`);

  // ================================================================
  // 12. Create CMS pages
  // ================================================================
  console.log("Creating CMS pages...");
  const cmsPages = [
    {
      slug: "about-us",
      title: { en: "About Us", de: "Uber uns", fr: "A propos" },
      body: {
        en: "MenonTrucks is Europe's leading online marketplace for commercial vehicles. Founded in 2020, we connect buyers and sellers of trucks, trailers, and construction equipment across the continent. With thousands of listings and verified dealers, we make buying and selling commercial vehicles simple, transparent, and secure.",
        de: "MenonTrucks ist Europas fuehrender Online-Marktplatz fuer Nutzfahrzeuge. Gegruendet im Jahr 2020, verbinden wir Kaeufer und Verkaeufer von LKW, Aufliegern und Baumaschinen auf dem gesamten Kontinent.",
        fr: "MenonTrucks est le principal marche en ligne europeen pour les vehicules commerciaux. Fonde en 2020, nous connectons les acheteurs et les vendeurs de camions, remorques et engins de chantier a travers le continent.",
      },
      isPublished: true,
      sortOrder: 0,
    },
    {
      slug: "terms-of-service",
      title: { en: "Terms of Service", de: "Nutzungsbedingungen", fr: "Conditions d'utilisation" },
      body: {
        en: "These Terms of Service govern your use of the MenonTrucks platform. By accessing or using our website, you agree to be bound by these terms. MenonTrucks acts as an intermediary platform connecting buyers and sellers. We do not own or sell any vehicles listed on the platform. All transactions are conducted directly between buyers and sellers. Users must provide accurate information and comply with all applicable laws.",
        de: "Diese Nutzungsbedingungen regeln Ihre Nutzung der MenonTrucks-Plattform.",
        fr: "Ces conditions d'utilisation regissent votre utilisation de la plateforme MenonTrucks.",
      },
      isPublished: true,
      sortOrder: 1,
    },
    {
      slug: "privacy-policy",
      title: { en: "Privacy Policy", de: "Datenschutzerklaerung", fr: "Politique de confidentialite" },
      body: {
        en: "At MenonTrucks, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform. We collect information you provide directly, such as your name, email, and phone number when you create an account. We also collect usage data to improve our services. We do not sell your personal information to third parties.",
        de: "Bei MenonTrucks nehmen wir Ihren Datenschutz ernst.",
        fr: "Chez MenonTrucks, nous prenons votre vie privee au serieux.",
      },
      isPublished: true,
      sortOrder: 2,
    },
    {
      slug: "cookie-policy",
      title: { en: "Cookie Policy", de: "Cookie-Richtlinie", fr: "Politique de cookies" },
      body: {
        en: "This Cookie Policy explains how MenonTrucks uses cookies and similar technologies on our website. We use essential cookies for the site to function properly, analytics cookies to understand how visitors use our site, and marketing cookies to deliver relevant advertising. You can manage your cookie preferences at any time through your browser settings.",
        de: "Diese Cookie-Richtlinie erklaert, wie MenonTrucks Cookies verwendet.",
        fr: "Cette politique de cookies explique comment MenonTrucks utilise les cookies.",
      },
      isPublished: true,
      sortOrder: 3,
    },
  ];

  for (const page of cmsPages) {
    await prisma.page.create({ data: page });
  }
  console.log(`  Created ${cmsPages.length} CMS pages.\n`);

  // ================================================================
  // Summary
  // ================================================================
  console.log("==============================================");
  console.log("Demo data seeding complete!");
  console.log("==============================================");
  console.log("");
  console.log("Login credentials:");
  console.log("  Admin:    admin@menontrucks.com    / Admin123!");
  console.log("  Sellers:  seller1-5@menontrucks.com / Seller123!");
  console.log("  Buyers:   buyer1-5@menontrucks.com  / Buyer123!");
  console.log("");
  console.log("Data created:");
  console.log(`  - 1 admin user`);
  console.log(`  - ${sellerUsers.length} sellers with profiles`);
  console.log(`  - ${buyerUsers.length} buyers`);
  console.log(`  - ${planRecords.length} subscription plans`);
  console.log(`  - ${listingRecords.length} listings with images`);
  console.log(`  - ${favoritesCreated} favorites`);
  console.log(`  - ${threadsCreated} message threads`);
  console.log(`  - ${notificationsCreated} notifications`);
  console.log(`  - ${cmsPages.length} CMS pages`);
  console.log(`  - ${brandRecords.length} brands with models`);
  console.log(`  - ${categoryRecords.length} categories`);
  console.log("");
}

// ---- Execute ----

seed()
  .catch((error) => {
    console.error("Seeder failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
