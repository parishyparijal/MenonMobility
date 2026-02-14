import prisma from "@/config/database";
import { seedCategories } from "./category.seeder";
import { seedBrands } from "./brand.seeder";

// ---------------------------------------------------------------------------
// Main Seed Runner
// ---------------------------------------------------------------------------

/**
 * Run all seeders in the correct order.
 * Categories must be seeded before brands (brands reference categories).
 */
export async function seed(): Promise<void> {
  console.log("=== Starting database seed ===\n");

  const startTime = Date.now();

  try {
    // 1. Categories first (brands depend on them via BrandCategory)
    await seedCategories();
    console.log("");

    // 2. Brands and models (references categories)
    await seedBrands();
    console.log("");

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`=== Seed completed in ${elapsed}s ===`);
  } catch (error) {
    console.error("=== Seed failed ===");
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running directly: npx tsx src/seeders/index.ts
// or via: npx ts-node -r tsconfig-paths/register src/seeders/index.ts
const isMainModule =
  typeof require !== "undefined" && require.main === module;

if (isMainModule) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
