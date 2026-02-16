import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function json(en: string) {
  return { en };
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { name: "Trucks", slug: "trucks", icon: "truck", description: "Commercial trucks, tractor units, box trucks, and heavy-duty vehicles" },
  { name: "Trailers", slug: "trailers", icon: "container", description: "Semi-trailers, flatbeds, refrigerated trailers and more" },
  { name: "Construction", slug: "construction", icon: "hard-hat", description: "Excavators, loaders, cranes and construction equipment" },
  { name: "Vans", slug: "vans", icon: "truck", description: "Cargo vans, delivery vans, and commercial vans" },
  { name: "Cars", slug: "cars", icon: "car", description: "Commercial cars, fleet vehicles, and company cars" },
  { name: "Containers", slug: "containers", icon: "box", description: "Shipping containers, storage containers, and specialized containers" },
  { name: "Parts", slug: "parts", icon: "wrench", description: "Truck parts, trailer parts, and commercial vehicle accessories" },
  { name: "Agricultural", slug: "agricultural", icon: "tractor", description: "Tractors, harvesters, and agricultural machinery" },
];

const BRANDS: { name: string; slug: string; categories: string[]; models: string[] }[] = [
  {
    name: "Mercedes-Benz", slug: "mercedes-benz", categories: ["trucks", "vans", "cars"],
    models: ["Actros", "Arocs", "Atego", "Econic", "Sprinter", "Vito", "E-Class", "S-Class"],
  },
  {
    name: "Volvo", slug: "volvo", categories: ["trucks", "construction", "cars"],
    models: ["FH", "FH16", "FM", "FMX", "FL", "FE", "EC220E", "L120H", "XC90", "XC60"],
  },
  {
    name: "Scania", slug: "scania", categories: ["trucks"],
    models: ["R 450", "R 500", "R 540", "S 500", "S 730", "G 410", "P 280", "L 280"],
  },
  {
    name: "MAN", slug: "man", categories: ["trucks"],
    models: ["TGX 18.510", "TGX 26.510", "TGS 18.470", "TGM 18.320", "TGL 12.250"],
  },
  {
    name: "DAF", slug: "daf", categories: ["trucks"],
    models: ["XF 480", "XG+ 530", "XD 450", "CF 370", "LF 230"],
  },
  {
    name: "Iveco", slug: "iveco", categories: ["trucks", "vans"],
    models: ["S-Way", "X-Way", "Eurocargo", "Daily", "eDaily"],
  },
  {
    name: "Renault", slug: "renault", categories: ["trucks", "vans"],
    models: ["T High", "T", "C", "D", "D Wide", "Master", "Trafic"],
  },
  {
    name: "Caterpillar", slug: "caterpillar", categories: ["construction"],
    models: ["320 GC", "330 GC", "336", "950 GC", "D6", "140 GC"],
  },
  {
    name: "Komatsu", slug: "komatsu", categories: ["construction"],
    models: ["PC210", "PC360", "WA380", "D65PX", "HB365"],
  },
  {
    name: "Liebherr", slug: "liebherr", categories: ["construction"],
    models: ["R 920", "R 926", "L 566 XPower", "LTM 1100", "LTM 1300"],
  },
  {
    name: "CASE", slug: "case", categories: ["construction", "agricultural"],
    models: ["CX210D", "CX370D", "821G", "Magnum 340", "Puma 240"],
  },
  {
    name: "John Deere", slug: "john-deere", categories: ["agricultural", "construction"],
    models: ["6R 250", "7R 350", "8R 410", "9RX 640", "S780", "345G LC"],
  },
  {
    name: "Schmitz Cargobull", slug: "schmitz-cargobull", categories: ["trailers"],
    models: ["SCS 24/L", "SKO 24/L", "S.KI SOLID", "S.CF"],
  },
  {
    name: "Krone", slug: "krone", categories: ["trailers"],
    models: ["Mega Liner", "Profi Liner", "Cool Liner", "Box Liner"],
  },
  {
    name: "Kogel", slug: "kogel", categories: ["trailers"],
    models: ["Cargo", "Mega", "Cool", "Port 45"],
  },
  {
    name: "Ford", slug: "ford", categories: ["vans", "cars"],
    models: ["Transit", "Transit Custom", "Ranger", "Focus", "Mondeo"],
  },
  {
    name: "Volkswagen", slug: "volkswagen", categories: ["vans", "cars"],
    models: ["Crafter", "Transporter", "Caddy", "Passat", "Golf"],
  },
  {
    name: "BMW", slug: "bmw", categories: ["cars"],
    models: ["3 Series", "5 Series", "X3", "X5", "iX"],
  },
  {
    name: "Audi", slug: "audi", categories: ["cars"],
    models: ["A4", "A6", "Q5", "Q7", "e-tron"],
  },
  {
    name: "Toyota", slug: "toyota", categories: ["cars"],
    models: ["Hilux", "Land Cruiser", "Corolla", "RAV4", "Proace"],
  },
  {
    name: "JCB", slug: "jcb", categories: ["construction"],
    models: ["3CX", "220X", "JS220", "535-95", "TM320"],
  },
  {
    name: "New Holland", slug: "new-holland", categories: ["agricultural"],
    models: ["T7.315", "T6.180", "CR10.90", "BigBaler 1290"],
  },
  {
    name: "Fendt", slug: "fendt", categories: ["agricultural"],
    models: ["1050 Vario", "942 Vario", "724 Vario", "516 Vario"],
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Free", slug: "free", description: "Get started with basic listings",
    priceMonthly: 0, priceYearly: 0, maxListings: 3, maxImages: 5,
    features: ["Up to 3 listings", "5 images per listing", "Basic support", "Standard visibility"],
    sortOrder: 0,
  },
  {
    name: "Professional", slug: "professional", description: "For growing dealers and sellers",
    priceMonthly: 49, priceYearly: 470, maxListings: 50, maxImages: 20,
    features: ["Up to 50 listings", "20 images per listing", "Priority support", "Enhanced visibility", "Analytics dashboard", "Featured listing credits"],
    sortOrder: 1,
  },
  {
    name: "Enterprise", slug: "enterprise", description: "For large dealerships and fleets",
    priceMonthly: 149, priceYearly: 1430, maxListings: 500, maxImages: 40,
    features: ["Up to 500 listings", "40 images per listing", "Dedicated account manager", "Top visibility", "Advanced analytics", "Bulk import/export", "API access", "Custom branding"],
    sortOrder: 2,
  },
];

const LOCATIONS = [
  { countryCode: "NL", countryName: "Netherlands", cities: ["Rotterdam", "Amsterdam", "Eindhoven", "Utrecht", "Breda", "Tilburg"] },
  { countryCode: "DE", countryName: "Germany", cities: ["Hamburg", "Munich", "Cologne", "Stuttgart", "Dusseldorf", "Bremen", "Hannover", "Frankfurt"] },
  { countryCode: "BE", countryName: "Belgium", cities: ["Antwerp", "Brussels", "Ghent", "Liege"] },
  { countryCode: "FR", countryName: "France", cities: ["Paris", "Lyon", "Marseille", "Lille"] },
  { countryCode: "PL", countryName: "Poland", cities: ["Warsaw", "Krakow", "Wroclaw", "Gdansk"] },
  { countryCode: "ES", countryName: "Spain", cities: ["Madrid", "Barcelona", "Valencia", "Seville"] },
  { countryCode: "IT", countryName: "Italy", cities: ["Milan", "Rome", "Turin", "Bologna"] },
  { countryCode: "GB", countryName: "United Kingdom", cities: ["London", "Birmingham", "Manchester", "Leeds"] },
  { countryCode: "SE", countryName: "Sweden", cities: ["Stockholm", "Gothenburg", "Malmo"] },
  { countryCode: "AT", countryName: "Austria", cities: ["Vienna", "Salzburg", "Graz"] },
  { countryCode: "CZ", countryName: "Czech Republic", cities: ["Prague", "Brno", "Ostrava"] },
  { countryCode: "DK", countryName: "Denmark", cities: ["Copenhagen", "Aarhus", "Odense"] },
];

// ---------------------------------------------------------------------------
// Listing templates per category for realistic data
// ---------------------------------------------------------------------------
interface ListingTemplate {
  titleFn: (brand: string, model: string) => string;
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  fuelTypes: ("DIESEL" | "PETROL" | "ELECTRIC" | "HYBRID" | "LPG" | "CNG" | "HYDROGEN")[];
  transmissions: ("MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC")[];
  conditions: ("NEW" | "USED" | "REFURBISHED")[];
}

const LISTING_TEMPLATES: Record<string, ListingTemplate> = {
  trucks: {
    titleFn: (b, m) => `${b} ${m} 4x2 BLS`,
    priceRange: [45000, 180000],
    yearRange: [2016, 2025],
    mileageRange: [20000, 850000],
    fuelTypes: ["DIESEL", "DIESEL", "DIESEL", "ELECTRIC"],
    transmissions: ["AUTOMATIC", "MANUAL", "SEMI_AUTOMATIC"],
    conditions: ["USED", "USED", "USED", "NEW"],
  },
  trailers: {
    titleFn: (b, m) => `${b} ${m}`,
    priceRange: [8000, 65000],
    yearRange: [2015, 2025],
    mileageRange: [0, 0],
    fuelTypes: [],
    transmissions: [],
    conditions: ["USED", "USED", "NEW"],
  },
  construction: {
    titleFn: (b, m) => `${b} ${m} Excavator`,
    priceRange: [40000, 350000],
    yearRange: [2014, 2025],
    mileageRange: [500, 15000],
    fuelTypes: ["DIESEL", "DIESEL", "ELECTRIC"],
    transmissions: [],
    conditions: ["USED", "USED", "NEW"],
  },
  vans: {
    titleFn: (b, m) => `${b} ${m} L3H2`,
    priceRange: [12000, 65000],
    yearRange: [2017, 2025],
    mileageRange: [10000, 300000],
    fuelTypes: ["DIESEL", "DIESEL", "PETROL", "ELECTRIC"],
    transmissions: ["MANUAL", "AUTOMATIC"],
    conditions: ["USED", "USED", "NEW"],
  },
  cars: {
    titleFn: (b, m) => `${b} ${m}`,
    priceRange: [8000, 85000],
    yearRange: [2018, 2025],
    mileageRange: [5000, 200000],
    fuelTypes: ["DIESEL", "PETROL", "ELECTRIC", "HYBRID"],
    transmissions: ["AUTOMATIC", "MANUAL"],
    conditions: ["USED", "USED", "NEW"],
  },
  containers: {
    titleFn: (_, m) => m,
    priceRange: [1500, 18000],
    yearRange: [2010, 2024],
    mileageRange: [0, 0],
    fuelTypes: [],
    transmissions: [],
    conditions: ["USED", "USED", "NEW", "REFURBISHED"],
  },
  parts: {
    titleFn: (b, m) => `${b} ${m}`,
    priceRange: [25, 12000],
    yearRange: [2015, 2025],
    mileageRange: [0, 0],
    fuelTypes: [],
    transmissions: [],
    conditions: ["NEW", "USED", "REFURBISHED"],
  },
  agricultural: {
    titleFn: (b, m) => `${b} ${m}`,
    priceRange: [25000, 400000],
    yearRange: [2015, 2025],
    mileageRange: [500, 12000],
    fuelTypes: ["DIESEL"],
    transmissions: ["AUTOMATIC", "MANUAL"],
    conditions: ["USED", "USED", "NEW"],
  },
};

// Container-specific listing names (no brand)
const CONTAINER_TITLES = [
  "20ft Standard Shipping Container",
  "40ft High Cube Container HC",
  "40ft Reefer Container Carrier Unit",
  "20ft Storage Container Side Opening",
  "40ft Open Top Container",
  "20ft Tank Container ISO",
  "45ft High Cube Pallet Wide",
  "20ft Flat Rack Container",
];

// Parts-specific listing names
const PARTS_TITLES = [
  "Engine Assembly Complete",
  "Brake Caliper Set Heavy Duty",
  "Tyre Set 315/80 R22.5",
  "Air Filter Kit Premium",
  "Turbocharger Replacement Unit",
  "Clutch Kit Complete",
  "Radiator Assembly",
  "Alternator Heavy Duty 28V",
  "Gearbox Transmission Unit",
  "Exhaust System DPF Complete",
];

const SELLERS = [
  { company: "TransEuropa BV", city: "Rotterdam", country: "NL", desc: "Leading European truck dealer with 30+ years of experience. Specializing in premium used trucks." },
  { company: "Nordic Trucks GmbH", city: "Hamburg", country: "DE", desc: "Your trusted partner for Scandinavian truck brands. Wide selection of Volvo and Scania vehicles." },
  { company: "FleetPro NV", city: "Antwerp", country: "BE", desc: "Professional fleet solutions for businesses across Europe. Quality pre-owned vehicles." },
  { company: "BavariaTruck AG", city: "Munich", country: "DE", desc: "Premium truck dealership in Southern Germany. MAN and Mercedes-Benz specialists." },
  { company: "DutchFleet BV", city: "Eindhoven", country: "NL", desc: "Netherlands' largest independent truck dealer. All major brands available." },
  { company: "IberiaTruck SL", city: "Madrid", country: "ES", desc: "Spain's premier commercial vehicle marketplace. New and used trucks." },
  { company: "FleetFrance SA", city: "Paris", country: "FR", desc: "French commercial vehicle specialist with nationwide service network." },
  { company: "PolTruck Sp.", city: "Warsaw", country: "PL", desc: "Central Europe's fastest growing truck dealer. Competitive prices, reliable vehicles." },
  { company: "EuroConstruct AG", city: "Stuttgart", country: "DE", desc: "Construction equipment specialist. CAT, Komatsu, Liebherr authorized dealer." },
  { company: "AgriMachinery BV", city: "Utrecht", country: "NL", desc: "Agricultural machinery and equipment dealer. New and pre-owned." },
];

// ---------------------------------------------------------------------------
// Main Seed Function
// ---------------------------------------------------------------------------
async function main() {
  console.log("Starting database seed...\n");

  // 1. Categories
  console.log("1. Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: randomUUID(),
        name: json(cat.name),
        slug: cat.slug,
        description: json(cat.description),
        icon: cat.icon,
        sortOrder: CATEGORIES.indexOf(cat),
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`   Created ${categoryMap.size} categories`);

  // 2. Brands & Models
  console.log("2. Seeding brands and models...");
  const brandMap = new Map<string, string>();
  const modelMap = new Map<string, { id: string; name: string; brandSlug: string }[]>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        id: randomUUID(),
        name: brand.name,
        slug: brand.slug,
        isActive: true,
      },
    });
    brandMap.set(brand.slug, created.id);

    // Brand-Category links
    for (const catSlug of brand.categories) {
      const catId = categoryMap.get(catSlug);
      if (catId) {
        await prisma.brandCategory.upsert({
          where: { brandId_categoryId: { brandId: created.id, categoryId: catId } },
          update: {},
          create: { id: randomUUID(), brandId: created.id, categoryId: catId },
        });
      }
    }

    // Models
    const models: { id: string; name: string; brandSlug: string }[] = [];
    for (const modelName of brand.models) {
      const modelSlug = slugify(`${brand.slug}-${modelName}`);
      const m = await prisma.brandModel.upsert({
        where: { id: randomUUID() },
        update: {},
        create: {
          id: randomUUID(),
          brandId: created.id,
          name: modelName,
          slug: modelSlug,
          isActive: true,
        },
      });
      models.push({ id: m.id, name: modelName, brandSlug: brand.slug });
    }
    modelMap.set(brand.slug, models);
  }
  console.log(`   Created ${brandMap.size} brands with models`);

  // 3. Locations
  console.log("3. Seeding locations...");
  let locationCount = 0;
  for (const loc of LOCATIONS) {
    for (const city of loc.cities) {
      await prisma.location.upsert({
        where: { countryCode_city: { countryCode: loc.countryCode, city } },
        update: {},
        create: {
          id: randomUUID(),
          countryCode: loc.countryCode,
          countryName: loc.countryName,
          city,
        },
      });
      locationCount++;
    }
  }
  console.log(`   Created ${locationCount} locations`);

  // 4. Subscription Plans
  console.log("4. Seeding subscription plans...");
  for (const plan of SUBSCRIPTION_PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: {
        id: randomUUID(),
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxListings: plan.maxListings,
        maxImages: plan.maxImages,
        features: plan.features,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
    });
  }
  console.log(`   Created ${SUBSCRIPTION_PLANS.length} subscription plans`);

  // 5. Admin user
  console.log("5. Creating admin user...");
  const adminPwHash = await bcrypt.hash("Admin2026!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@menonmobility.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "Admin",
      email: "admin@menonmobility.com",
      passwordHash: adminPwHash,
      role: "ADMIN",
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`   Admin user: admin@menonmobility.com / Admin2026!`);

  // 6. Seller users + profiles
  console.log("6. Creating seller users and profiles...");
  const sellerIds: string[] = [];
  const sellerPwHash = await bcrypt.hash("Seller2026!", 12);
  for (let i = 0; i < SELLERS.length; i++) {
    const s = SELLERS[i];
    const email = `${slugify(s.company)}@menonmobility.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: randomUUID(),
        name: s.company,
        email,
        passwordHash: sellerPwHash,
        role: "SELLER",
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });
    sellerIds.push(user.id);

    const profileSlug = slugify(s.company);
    await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: randomUUID(),
        userId: user.id,
        companyName: s.company,
        slug: profileSlug,
        description: s.desc,
        city: s.city,
        countryCode: s.country,
        isVerified: i < 5, // First 5 sellers are verified
        verifiedAt: i < 5 ? new Date() : undefined,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: randomInt(5, 120),
      },
    });
  }
  console.log(`   Created ${SELLERS.length} sellers`);

  // 7. Listings — ~50 per category = ~400 total
  console.log("7. Creating listings...");
  let listingCount = 0;
  const now = new Date();

  for (const cat of CATEGORIES) {
    const catId = categoryMap.get(cat.slug)!;
    const template = LISTING_TEMPLATES[cat.slug];
    if (!template) continue;

    // Get brands for this category
    const catBrands = BRANDS.filter((b) => b.categories.includes(cat.slug));
    const listingsPerCategory = cat.slug === "parts" || cat.slug === "containers" ? 30 : 50;

    for (let i = 0; i < listingsPerCategory; i++) {
      const brand = catBrands.length > 0 ? randomItem(catBrands) : null;
      const brandId = brand ? brandMap.get(brand.slug) || null : null;
      const models = brand ? modelMap.get(brand.slug) || [] : [];
      const model = models.length > 0 ? randomItem(models) : null;

      let title: string;
      if (cat.slug === "containers") {
        title = randomItem(CONTAINER_TITLES);
      } else if (cat.slug === "parts") {
        title = `${brand?.name || "Universal"} ${randomItem(PARTS_TITLES)}`;
      } else {
        title = template.titleFn(brand?.name || "Unknown", model?.name || "");
      }

      const condition = randomItem(template.conditions) as any;
      const price = randomInt(template.priceRange[0], template.priceRange[1]);
      const year = randomInt(template.yearRange[0], template.yearRange[1]);
      const mileage = condition === "NEW" ? 0 : randomInt(template.mileageRange[0], template.mileageRange[1]);
      const fuelType = template.fuelTypes.length > 0 ? randomItem(template.fuelTypes) as any : null;
      const transmission = template.transmissions.length > 0 ? randomItem(template.transmissions) as any : null;
      const loc = randomItem(LOCATIONS);
      const city = randomItem(loc.cities);
      const seller = randomItem(sellerIds);

      const listingSlug = slugify(`${title}-${year}-${randomInt(1000, 9999)}`);

      // Random published date in last 90 days
      const daysAgo = randomInt(0, 90);
      const publishedAt = new Date(now.getTime() - daysAgo * 86400000);

      await prisma.listing.create({
        data: {
          id: randomUUID(),
          sellerId: seller,
          categoryId: catId,
          brandId,
          modelId: model?.id || null,
          title,
          slug: listingSlug,
          description: `${condition === "NEW" ? "Brand new" : "Well-maintained"} ${title}. ${condition === "NEW" ? "Full factory warranty." : `${mileage > 0 ? mileage.toLocaleString() + " km." : ""}`} Available for immediate delivery. Contact us for more details and inspection.`,
          price,
          priceCurrency: "EUR",
          condition,
          status: "ACTIVE",
          year,
          mileageKm: mileage > 0 ? mileage : null,
          fuelType,
          transmission,
          emissionClass: fuelType === "DIESEL" ? randomItem(["EURO5", "EURO6", "EURO6D"]) as any : null,
          countryCode: loc.countryCode,
          city,
          viewCount: randomInt(10, 2500),
          favoriteCount: randomInt(0, 50),
          isFeatured: i < 3, // First 3 per category are featured
          featuredUntil: i < 3 ? new Date(now.getTime() + 30 * 86400000) : null,
          publishedAt,
          createdAt: publishedAt,
        },
      });
      listingCount++;
    }

    // Update category listing count
    await prisma.category.update({
      where: { id: catId },
      data: { listingCount: listingsPerCategory },
    });
  }
  console.log(`   Created ${listingCount} listings`);

  // 8. Site Languages
  console.log("8. Seeding site languages...");
  const SITE_LANGUAGES = [
    { code: "nl-BE", name: "Nederlands", localName: "België | Nederlands", countryCode: "be", isDefault: false, sortOrder: 0 },
    { code: "fr-BE", name: "Français", localName: "Belgique | Français", countryCode: "be", isDefault: false, sortOrder: 1 },
    { code: "en", name: "English", localName: "International | English", countryCode: "eu", isDefault: true, sortOrder: 2 },
    { code: "de", name: "Deutsch", localName: "Deutschland | Deutsch", countryCode: "de", isDefault: false, sortOrder: 3 },
    { code: "fr", name: "Français", localName: "France | Français", countryCode: "fr", isDefault: false, sortOrder: 4 },
    { code: "pl", name: "Polski", localName: "Polska | Polski", countryCode: "pl", isDefault: false, sortOrder: 5 },
    { code: "es", name: "Español", localName: "España | Español", countryCode: "es", isDefault: false, sortOrder: 6 },
    { code: "it", name: "Italiano", localName: "Italia | Italiano", countryCode: "it", isDefault: false, sortOrder: 7 },
    { code: "pt", name: "Português", localName: "Portugal | Português", countryCode: "pt", isDefault: false, sortOrder: 8 },
    { code: "cs", name: "Čeština", localName: "Česká republika | Čeština", countryCode: "cz", isDefault: false, sortOrder: 9 },
    { code: "ru", name: "Русский", localName: "Россия | Русский", countryCode: "ru", isDefault: false, sortOrder: 10 },
  ];

  for (const lang of SITE_LANGUAGES) {
    await prisma.siteLanguage.upsert({
      where: { code: lang.code },
      update: {},
      create: {
        id: randomUUID(),
        ...lang,
        isActive: true,
      },
    });
  }
  console.log(`   Created ${SITE_LANGUAGES.length} site languages`);

  // 9. Summary
  console.log("\n========================================");
  console.log("Seed completed successfully!");
  console.log("========================================");
  console.log(`Categories:         ${categoryMap.size}`);
  console.log(`Brands:             ${brandMap.size}`);
  console.log(`Locations:          ${locationCount}`);
  console.log(`Subscription Plans: ${SUBSCRIPTION_PLANS.length}`);
  console.log(`Sellers:            ${SELLERS.length}`);
  console.log(`Listings:           ${listingCount}`);
  console.log(`Site Languages:     ${SITE_LANGUAGES.length}`);
  console.log("");
  console.log("Admin login: admin@menonmobility.com / Admin2026!");
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
