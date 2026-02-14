import prisma from "@/config/database";

// ---------------------------------------------------------------------------
// Brand Seeder — 30+ brands, 200+ models, with category links
// ---------------------------------------------------------------------------

interface ModelSeed {
  name: string;
  slug: string;
}

interface BrandSeed {
  name: string;
  slug: string;
  models: ModelSeed[];
  /** Category slugs this brand should be linked to */
  categorySlugs: string[];
}

const BRANDS: BrandSeed[] = [
  // ─── TRUCK BRANDS ───────────────────────────────────────────────
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks", "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "Actros", slug: "actros" },
      { name: "Arocs", slug: "arocs" },
      { name: "Atego", slug: "atego" },
      { name: "Econic", slug: "econic" },
      { name: "Unimog", slug: "unimog" },
      { name: "eActros", slug: "eactros" },
      { name: "Zetros", slug: "zetros" },
      { name: "Sprinter", slug: "sprinter" },
      { name: "Vito", slug: "vito" },
      { name: "Citan", slug: "citan" },
    ],
  },
  {
    name: "Volvo",
    slug: "volvo",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks",
    ],
    models: [
      { name: "FH", slug: "fh" },
      { name: "FH16", slug: "fh16" },
      { name: "FM", slug: "fm" },
      { name: "FMX", slug: "fmx" },
      { name: "FE", slug: "fe" },
      { name: "FL", slug: "fl" },
      { name: "FH Electric", slug: "fh-electric" },
    ],
  },
  {
    name: "Scania",
    slug: "scania",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks",
    ],
    models: [
      { name: "R-Series", slug: "r-series" },
      { name: "S-Series", slug: "s-series" },
      { name: "G-Series", slug: "g-series" },
      { name: "P-Series", slug: "p-series" },
      { name: "L-Series", slug: "l-series" },
      { name: "XT", slug: "xt" },
      { name: "Super", slug: "super" },
    ],
  },
  {
    name: "MAN",
    slug: "man",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks",
    ],
    models: [
      { name: "TGX", slug: "tgx" },
      { name: "TGS", slug: "tgs" },
      { name: "TGM", slug: "tgm" },
      { name: "TGL", slug: "tgl" },
      { name: "TGE", slug: "tge" },
      { name: "eTGM", slug: "etgm" },
    ],
  },
  {
    name: "DAF",
    slug: "daf",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks",
    ],
    models: [
      { name: "XF", slug: "xf" },
      { name: "XG", slug: "xg" },
      { name: "XG+", slug: "xg-plus" },
      { name: "XD", slug: "xd" },
      { name: "XB", slug: "xb" },
      { name: "CF", slug: "cf" },
      { name: "LF", slug: "lf" },
    ],
  },
  {
    name: "Iveco",
    slug: "iveco",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks", "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "S-Way", slug: "s-way" },
      { name: "X-Way", slug: "x-way" },
      { name: "T-Way", slug: "t-way" },
      { name: "Eurocargo", slug: "eurocargo" },
      { name: "Daily", slug: "daily" },
      { name: "eDaily", slug: "edaily" },
    ],
  },
  {
    name: "Renault Trucks",
    slug: "renault-trucks",
    categorySlugs: [
      "trucks", "tractor-units", "box-trucks", "flatbed-trucks", "tipper-trucks",
      "refrigerated-trucks", "crane-trucks", "tank-trucks", "curtainsider-trucks",
      "other-trucks",
    ],
    models: [
      { name: "T", slug: "t" },
      { name: "T High", slug: "t-high" },
      { name: "C", slug: "c" },
      { name: "D", slug: "d" },
      { name: "D Wide", slug: "d-wide" },
    ],
  },

  // ─── TRAILER BRANDS ─────────────────────────────────────────────
  {
    name: "Schmitz Cargobull",
    slug: "schmitz-cargobull",
    categorySlugs: [
      "trailers", "semi-trailers", "curtainsider-trailers", "flatbed-trailers",
      "refrigerated-trailers", "tipper-trailers", "other-trailers",
    ],
    models: [
      { name: "S.CS", slug: "s-cs" },
      { name: "S.CS FIXED WALL", slug: "s-cs-fixed-wall" },
      { name: "S.KO", slug: "s-ko" },
      { name: "S.KO COOL", slug: "s-ko-cool" },
      { name: "S.KI", slug: "s-ki" },
      { name: "S.CF", slug: "s-cf" },
      { name: "S.BO", slug: "s-bo" },
    ],
  },
  {
    name: "Krone",
    slug: "krone",
    categorySlugs: [
      "trailers", "semi-trailers", "curtainsider-trailers", "flatbed-trailers",
      "refrigerated-trailers", "other-trailers",
    ],
    models: [
      { name: "Cool Liner", slug: "cool-liner" },
      { name: "Mega Liner", slug: "mega-liner" },
      { name: "Profi Liner", slug: "profi-liner" },
      { name: "Dry Liner", slug: "dry-liner" },
      { name: "Box Liner", slug: "box-liner" },
      { name: "Container Liner", slug: "container-liner" },
    ],
  },
  {
    name: "Kogel",
    slug: "kogel",
    categorySlugs: [
      "trailers", "semi-trailers", "curtainsider-trailers", "flatbed-trailers",
      "refrigerated-trailers", "other-trailers",
    ],
    models: [
      { name: "Cargo", slug: "cargo" },
      { name: "Cool", slug: "cool" },
      { name: "Port", slug: "port" },
      { name: "Lightplus", slug: "lightplus" },
    ],
  },

  // ─── EQUIPMENT BRANDS ───────────────────────────────────────────
  {
    name: "Caterpillar",
    slug: "caterpillar",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders", "bulldozers",
      "compactors", "other-construction",
    ],
    models: [
      { name: "320", slug: "320" },
      { name: "330", slug: "330" },
      { name: "336", slug: "336" },
      { name: "950", slug: "950" },
      { name: "966", slug: "966" },
      { name: "D6", slug: "d6" },
      { name: "D8", slug: "d8" },
      { name: "140M", slug: "140m" },
    ],
  },
  {
    name: "Komatsu",
    slug: "komatsu",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders", "bulldozers",
      "other-construction",
    ],
    models: [
      { name: "PC210", slug: "pc210" },
      { name: "PC360", slug: "pc360" },
      { name: "PC490", slug: "pc490" },
      { name: "WA380", slug: "wa380" },
      { name: "WA470", slug: "wa470" },
      { name: "D65", slug: "d65" },
    ],
  },
  {
    name: "JCB",
    slug: "jcb",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders",
      "other-construction", "material-handling", "telehandlers",
    ],
    models: [
      { name: "3CX", slug: "3cx" },
      { name: "4CX", slug: "4cx" },
      { name: "JS220", slug: "js220" },
      { name: "JS360", slug: "js360" },
      { name: "531-70", slug: "531-70" },
      { name: "535-95", slug: "535-95" },
    ],
  },
  {
    name: "Liebherr",
    slug: "liebherr",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders", "cranes",
      "concrete-mixers", "other-construction", "material-handling",
    ],
    models: [
      { name: "R920", slug: "r920" },
      { name: "R946", slug: "r946" },
      { name: "R960", slug: "r960" },
      { name: "A918", slug: "a918" },
      { name: "L566", slug: "l566" },
      { name: "L580", slug: "l580" },
      { name: "LTM 1100", slug: "ltm-1100" },
      { name: "LTM 1300", slug: "ltm-1300" },
      { name: "HTM 905", slug: "htm-905" },
    ],
  },
  {
    name: "Volvo CE",
    slug: "volvo-ce",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders",
      "compactors", "other-construction",
    ],
    models: [
      { name: "EC220", slug: "ec220" },
      { name: "EC350", slug: "ec350" },
      { name: "EC480", slug: "ec480" },
      { name: "L120", slug: "l120" },
      { name: "L150", slug: "l150" },
      { name: "A30", slug: "a30" },
      { name: "A40", slug: "a40" },
    ],
  },
  {
    name: "Hitachi",
    slug: "hitachi",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders",
      "other-construction",
    ],
    models: [
      { name: "ZX210", slug: "zx210" },
      { name: "ZX350", slug: "zx350" },
      { name: "ZX490", slug: "zx490" },
      { name: "ZW220", slug: "zw220" },
    ],
  },
  {
    name: "Doosan",
    slug: "doosan",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders",
      "other-construction",
    ],
    models: [
      { name: "DX225", slug: "dx225" },
      { name: "DX340", slug: "dx340" },
      { name: "DX530", slug: "dx530" },
      { name: "DL250", slug: "dl250" },
    ],
  },

  // ─── AGRICULTURAL BRANDS ────────────────────────────────────────
  {
    name: "John Deere",
    slug: "john-deere",
    categorySlugs: [
      "agricultural-machinery", "tractors", "harvesters", "sprayers",
      "other-agricultural", "forestry-groundcare",
    ],
    models: [
      { name: "5R Series", slug: "5r-series" },
      { name: "6R Series", slug: "6r-series" },
      { name: "6M Series", slug: "6m-series" },
      { name: "7R Series", slug: "7r-series" },
      { name: "8R Series", slug: "8r-series" },
      { name: "9R Series", slug: "9r-series" },
      { name: "S780", slug: "s780" },
      { name: "S790", slug: "s790" },
      { name: "R4040i", slug: "r4040i" },
      { name: "1025R", slug: "1025r" },
    ],
  },
  {
    name: "Case IH",
    slug: "case-ih",
    categorySlugs: [
      "agricultural-machinery", "tractors", "harvesters",
      "other-agricultural",
    ],
    models: [
      { name: "Puma", slug: "puma" },
      { name: "Magnum", slug: "magnum" },
      { name: "Optum", slug: "optum" },
      { name: "Quadtrac", slug: "quadtrac" },
      { name: "Axial-Flow 250", slug: "axial-flow-250" },
    ],
  },
  {
    name: "New Holland",
    slug: "new-holland",
    categorySlugs: [
      "agricultural-machinery", "tractors", "harvesters",
      "other-agricultural",
    ],
    models: [
      { name: "T7", slug: "t7" },
      { name: "T8", slug: "t8" },
      { name: "T9", slug: "t9" },
      { name: "CR Revelation", slug: "cr-revelation" },
      { name: "CX8", slug: "cx8" },
    ],
  },
  {
    name: "Fendt",
    slug: "fendt",
    categorySlugs: [
      "agricultural-machinery", "tractors", "harvesters",
      "other-agricultural",
    ],
    models: [
      { name: "500 Vario", slug: "500-vario" },
      { name: "700 Vario", slug: "700-vario" },
      { name: "900 Vario", slug: "900-vario" },
      { name: "1000 Vario", slug: "1000-vario" },
      { name: "IDEAL", slug: "ideal" },
    ],
  },
  {
    name: "Claas",
    slug: "claas",
    categorySlugs: [
      "agricultural-machinery", "tractors", "harvesters",
      "other-agricultural",
    ],
    models: [
      { name: "Arion", slug: "arion" },
      { name: "Axion", slug: "axion" },
      { name: "Xerion", slug: "xerion" },
      { name: "Lexion", slug: "lexion" },
      { name: "Jaguar", slug: "jaguar" },
    ],
  },

  // ─── CASE CONSTRUCTION ──────────────────────────────────────────
  {
    name: "Case",
    slug: "case",
    categorySlugs: [
      "construction-machinery", "excavators", "wheel-loaders",
      "other-construction",
    ],
    models: [
      { name: "580", slug: "580" },
      { name: "590", slug: "590" },
      { name: "CX210", slug: "cx210" },
      { name: "CX350", slug: "cx350" },
      { name: "821G", slug: "821g" },
    ],
  },

  // ─── MATERIAL HANDLING BRANDS ───────────────────────────────────
  {
    name: "Toyota Material Handling",
    slug: "toyota-material-handling",
    categorySlugs: [
      "material-handling", "forklifts", "other-material-handling",
    ],
    models: [
      { name: "Tonero", slug: "tonero" },
      { name: "Traigo", slug: "traigo" },
      { name: "BT Levio", slug: "bt-levio" },
      { name: "BT Reflex", slug: "bt-reflex" },
    ],
  },
  {
    name: "Linde",
    slug: "linde",
    categorySlugs: [
      "material-handling", "forklifts", "reach-stackers",
      "other-material-handling",
    ],
    models: [
      { name: "H25", slug: "h25" },
      { name: "H50", slug: "h50" },
      { name: "E20", slug: "e20" },
      { name: "R14", slug: "r14" },
      { name: "R25", slug: "r25" },
    ],
  },
  {
    name: "Hyster",
    slug: "hyster",
    categorySlugs: [
      "material-handling", "forklifts", "reach-stackers",
      "other-material-handling",
    ],
    models: [
      { name: "H3.0FT", slug: "h3-0ft" },
      { name: "H5.0FT", slug: "h5-0ft" },
      { name: "RS45-31CH", slug: "rs45-31ch" },
      { name: "RS46-41LS", slug: "rs46-41ls" },
    ],
  },
  {
    name: "Kalmar",
    slug: "kalmar",
    categorySlugs: [
      "material-handling", "forklifts", "reach-stackers",
      "other-material-handling",
    ],
    models: [
      { name: "DCG80-160", slug: "dcg80-160" },
      { name: "DRF400-450", slug: "drf400-450" },
      { name: "Gloria", slug: "gloria" },
      { name: "Ottawa T2", slug: "ottawa-t2" },
    ],
  },
  {
    name: "Manitou",
    slug: "manitou",
    categorySlugs: [
      "material-handling", "telehandlers", "forklifts",
      "other-material-handling",
    ],
    models: [
      { name: "MT 625", slug: "mt-625" },
      { name: "MT 835", slug: "mt-835" },
      { name: "MT 1440", slug: "mt-1440" },
      { name: "MI 25", slug: "mi-25" },
      { name: "MHT 10230", slug: "mht-10230" },
    ],
  },

  // ─── VAN BRANDS ─────────────────────────────────────────────────
  {
    name: "Volkswagen",
    slug: "volkswagen",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "pickup-trucks", "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "Crafter", slug: "crafter" },
      { name: "Transporter", slug: "transporter" },
      { name: "Transporter T6.1", slug: "transporter-t6-1" },
      { name: "Caddy", slug: "caddy" },
      { name: "Caddy Cargo", slug: "caddy-cargo" },
      { name: "Amarok", slug: "amarok" },
      { name: "ID. Buzz Cargo", slug: "id-buzz-cargo" },
    ],
  },
  {
    name: "Ford",
    slug: "ford",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "pickup-trucks", "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "Transit", slug: "transit" },
      { name: "Transit Custom", slug: "transit-custom" },
      { name: "Transit Connect", slug: "transit-connect" },
      { name: "Transit Courier", slug: "transit-courier" },
      { name: "Ranger", slug: "ranger" },
      { name: "E-Transit", slug: "e-transit" },
    ],
  },
  {
    name: "Renault",
    slug: "renault",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "Master", slug: "master" },
      { name: "Trafic", slug: "trafic" },
      { name: "Kangoo", slug: "kangoo" },
    ],
  },
  {
    name: "Fiat Professional",
    slug: "fiat-professional",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs", "minibuses",
    ],
    models: [
      { name: "Ducato", slug: "ducato" },
      { name: "Scudo", slug: "scudo" },
      { name: "Doblo", slug: "doblo" },
    ],
  },
  {
    name: "Peugeot",
    slug: "peugeot",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs",
    ],
    models: [
      { name: "Boxer", slug: "boxer" },
      { name: "Expert", slug: "expert" },
      { name: "Partner", slug: "partner" },
    ],
  },
  {
    name: "Citroen",
    slug: "citroen",
    categorySlugs: [
      "vans-lcvs", "panel-vans", "box-vans", "refrigerated-vans",
      "chassis-cabs",
    ],
    models: [
      { name: "Jumper", slug: "jumper" },
      { name: "Jumpy", slug: "jumpy" },
      { name: "Berlingo", slug: "berlingo" },
    ],
  },
  {
    name: "Toyota",
    slug: "toyota",
    categorySlugs: [
      "vans-lcvs", "pickup-trucks", "cars", "passenger-cars", "suvs",
    ],
    models: [
      { name: "Hilux", slug: "hilux" },
      { name: "Land Cruiser", slug: "land-cruiser" },
      { name: "ProAce", slug: "proace" },
      { name: "ProAce City", slug: "proace-city" },
    ],
  },
  {
    name: "Nissan",
    slug: "nissan",
    categorySlugs: [
      "vans-lcvs", "pickup-trucks", "panel-vans",
    ],
    models: [
      { name: "Navara", slug: "navara" },
      { name: "NV400", slug: "nv400" },
      { name: "NV300", slug: "nv300" },
      { name: "NV250", slug: "nv250" },
    ],
  },
  {
    name: "Mitsubishi",
    slug: "mitsubishi",
    categorySlugs: [
      "vans-lcvs", "pickup-trucks",
    ],
    models: [
      { name: "L200", slug: "l200" },
      { name: "Canter", slug: "canter" },
      { name: "Fuso", slug: "fuso" },
    ],
  },
];

/**
 * Seed all brands, their models, and brand-category links.
 * Clears existing brand data first to avoid duplicates.
 */
export async function seedBrands(): Promise<void> {
  console.log("Seeding brands...");

  // Clear existing data (respect FK constraints)
  await prisma.brandCategory.deleteMany();
  await prisma.brandModel.deleteMany();
  await prisma.brand.deleteMany();

  // Build a slug-to-id map for categories
  const allCategories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  let totalModels = 0;
  let totalLinks = 0;

  for (const brandData of BRANDS) {
    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name: brandData.name,
        slug: brandData.slug,
        isActive: true,
      },
    });

    // Create models for this brand
    for (const modelData of brandData.models) {
      await prisma.brandModel.create({
        data: {
          brandId: brand.id,
          name: modelData.name,
          slug: modelData.slug,
          isActive: true,
        },
      });
      totalModels++;
    }

    // Create brand-category links
    for (const catSlug of brandData.categorySlugs) {
      const categoryId = categoryMap.get(catSlug);
      if (categoryId) {
        await prisma.brandCategory.create({
          data: {
            brandId: brand.id,
            categoryId,
          },
        });
        totalLinks++;
      } else {
        console.warn(`  Warning: Category slug "${catSlug}" not found for brand "${brandData.name}"`);
      }
    }
  }

  console.log(
    `Seeded ${BRANDS.length} brands, ${totalModels} models, and ${totalLinks} brand-category links successfully.`
  );
}
