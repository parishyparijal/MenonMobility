import esClient from "@/config/elasticsearch";
import prisma from "@/config/database";

// ---------------------------------------------------------------------------
// Elasticsearch Service
// ---------------------------------------------------------------------------
// Manages the "listings" index: creation, deletion, indexing, search, and
// autocomplete suggestions powered by custom analyzers.
// ---------------------------------------------------------------------------

const INDEX_NAME = process.env.ELASTICSEARCH_INDEX || "listings";

// ---------------------------------------------------------------------------
// Index Management
// ---------------------------------------------------------------------------

/**
 * Create the listings index with custom analyzers and field mappings.
 */
export async function createIndex(): Promise<void> {
  const exists = await esClient.indices.exists({ index: INDEX_NAME });
  if (exists) {
    console.log(`[ES] Index "${INDEX_NAME}" already exists — skipping creation.`);
    return;
  }

  await esClient.indices.create({
    index: INDEX_NAME,
    settings: {
      number_of_shards: 3,
      number_of_replicas: 1,
      analysis: {
        analyzer: {
          // Synonym analyzer: expands truck=lorry=hgv, merc=mercedes-benz, etc.
          synonym_analyzer: {
            tokenizer: "standard",
            filter: ["lowercase", "synonym_filter"],
          },
          // Edge-ngram analyzer for autocomplete (2-15 chars)
          autocomplete_analyzer: {
            tokenizer: "autocomplete_tokenizer",
            filter: ["lowercase"],
          },
          // Search-time analyzer for autocomplete (no edge-ngram on search side)
          autocomplete_search_analyzer: {
            tokenizer: "standard",
            filter: ["lowercase"],
          },
        },
        tokenizer: {
          autocomplete_tokenizer: {
            type: "edge_ngram",
            min_gram: 2,
            max_gram: 15,
            token_chars: ["letter", "digit"],
          },
        },
        filter: {
          synonym_filter: {
            type: "synonym",
            synonyms: [
              "truck,lorry,hgv",
              "merc,mercedes,mercedes-benz",
              "trailer,semi-trailer",
              "excavator,digger",
              "loader,front-loader,wheel-loader",
              "van,panel-van,delivery-van",
              "tractor,tractor-unit,cab",
              "refrigerated,reefer",
              "curtainside,curtainsider,tautliner",
              "tipper,dumper",
              "flatbed,platform",
              "crane,mobile-crane",
              "bulldozer,dozer",
              "forklift,fork-lift",
            ],
          },
        },
      },
    },
    mappings: {
      properties: {
        // Core fields
        id: { type: "keyword" },
        title: {
          type: "text",
          analyzer: "synonym_analyzer",
          fields: {
            keyword: { type: "keyword" },
            autocomplete: {
              type: "text",
              analyzer: "autocomplete_analyzer",
              search_analyzer: "autocomplete_search_analyzer",
            },
          },
        },
        slug: { type: "keyword" },
        description: {
          type: "text",
          analyzer: "synonym_analyzer",
        },

        // Category & Brand
        categoryId: { type: "keyword" },
        categoryName: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        categorySlug: { type: "keyword" },
        brandId: { type: "keyword" },
        brandName: {
          type: "text",
          analyzer: "synonym_analyzer",
          fields: { keyword: { type: "keyword" } },
        },
        brandSlug: { type: "keyword" },
        modelId: { type: "keyword" },
        modelName: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        modelSlug: { type: "keyword" },

        // Vehicle details
        price: { type: "float" },
        priceCurrency: { type: "keyword" },
        priceOnRequest: { type: "boolean" },
        condition: { type: "keyword" },
        year: { type: "integer" },
        mileageKm: { type: "integer" },
        operatingHours: { type: "integer" },
        fuelType: { type: "keyword" },
        transmission: { type: "keyword" },
        powerHp: { type: "integer" },
        emissionClass: { type: "keyword" },
        color: { type: "keyword" },
        bodyType: { type: "keyword" },
        driveConfiguration: { type: "keyword" },

        // Location
        countryCode: { type: "keyword" },
        region: { type: "keyword" },
        city: { type: "keyword" },
        location: { type: "geo_point" },

        // Seller
        sellerId: { type: "keyword" },
        sellerName: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        sellerCompany: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        sellerVerified: { type: "boolean" },

        // Status & Meta
        status: { type: "keyword" },
        isFeatured: { type: "boolean" },
        viewCount: { type: "integer" },
        favoriteCount: { type: "integer" },

        // Images (first image for search results)
        thumbnailUrl: { type: "keyword", index: false },
        mediumUrl: { type: "keyword", index: false },

        // Dates
        createdAt: { type: "date" },
        publishedAt: { type: "date" },
        updatedAt: { type: "date" },
      },
    },
  });

  console.log(`[ES] Index "${INDEX_NAME}" created successfully.`);
}

/**
 * Delete the listings index entirely.
 */
export async function deleteIndex(): Promise<void> {
  const exists = await esClient.indices.exists({ index: INDEX_NAME });
  if (!exists) {
    console.log(`[ES] Index "${INDEX_NAME}" does not exist — nothing to delete.`);
    return;
  }
  await esClient.indices.delete({ index: INDEX_NAME });
  console.log(`[ES] Index "${INDEX_NAME}" deleted.`);
}

// ---------------------------------------------------------------------------
// Document Indexing
// ---------------------------------------------------------------------------

/**
 * Convert a Prisma listing (with relations) into an ES document.
 */
function listingToDocument(listing: any): Record<string, any> {
  return {
    id: listing.id,
    title: listing.title,
    slug: listing.slug,
    description: listing.description || "",
    categoryId: listing.category?.id || listing.categoryId,
    categoryName: listing.category?.name || "",
    categorySlug: listing.category?.slug || "",
    brandId: listing.brand?.id || listing.brandId,
    brandName: listing.brand?.name || "",
    brandSlug: listing.brand?.slug || "",
    modelId: listing.model?.id || listing.modelId,
    modelName: listing.model?.name || "",
    modelSlug: listing.model?.slug || "",
    price: listing.price ? Number(listing.price) : 0,
    priceCurrency: listing.priceCurrency || "EUR",
    priceOnRequest: listing.priceOnRequest || false,
    condition: listing.condition,
    year: listing.year,
    mileageKm: listing.mileageKm,
    operatingHours: listing.operatingHours,
    fuelType: listing.fuelType,
    transmission: listing.transmission,
    powerHp: listing.powerHp,
    emissionClass: listing.emissionClass,
    color: listing.color,
    bodyType: listing.bodyType,
    driveConfiguration: listing.driveConfiguration,
    countryCode: listing.countryCode,
    region: listing.region,
    city: listing.city,
    location:
      listing.latitude && listing.longitude
        ? { lat: listing.latitude, lon: listing.longitude }
        : undefined,
    sellerId: listing.sellerId,
    sellerName: listing.seller?.name || "",
    sellerCompany: listing.seller?.sellerProfile?.companyName || "",
    sellerVerified: listing.seller?.sellerProfile?.isVerified || false,
    status: listing.status,
    isFeatured: listing.isFeatured || false,
    viewCount: listing.viewCount || 0,
    favoriteCount: listing.favoriteCount || 0,
    thumbnailUrl: listing.images?.[0]?.thumbnailUrl || "",
    mediumUrl: listing.images?.[0]?.mediumUrl || "",
    createdAt: listing.createdAt,
    publishedAt: listing.publishedAt,
    updatedAt: listing.updatedAt,
  };
}

/**
 * Index a single listing by its ID.
 */
export async function indexListing(listingId: string): Promise<void> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      model: { select: { id: true, name: true, slug: true } },
      seller: {
        select: {
          id: true,
          name: true,
          sellerProfile: { select: { companyName: true, isVerified: true } },
        },
      },
      images: {
        take: 1,
        orderBy: { position: "asc" },
        select: { thumbnailUrl: true, mediumUrl: true },
      },
    },
  });

  if (!listing) {
    console.warn(`[ES] Listing ${listingId} not found in DB — skipping.`);
    return;
  }

  await esClient.index({
    index: INDEX_NAME,
    id: listing.id,
    document: listingToDocument(listing),
  });

  console.log(`[ES] Indexed listing ${listingId}`);
}

/**
 * Remove a single listing from the index.
 */
export async function removeListing(listingId: string): Promise<void> {
  try {
    await esClient.delete({
      index: INDEX_NAME,
      id: listingId,
    });
    console.log(`[ES] Removed listing ${listingId} from index`);
  } catch (err: any) {
    if (err?.meta?.statusCode === 404) {
      console.warn(`[ES] Listing ${listingId} not found in index — skipping.`);
    } else {
      throw err;
    }
  }
}

/**
 * Bulk-index an array of listings (with relations already loaded).
 */
export async function bulkIndex(listings: any[]): Promise<number> {
  if (listings.length === 0) return 0;

  const operations = listings.flatMap((listing) => [
    { index: { _index: INDEX_NAME, _id: listing.id } },
    listingToDocument(listing),
  ]);

  const { errors, items } = await esClient.bulk({
    refresh: true,
    operations,
  });

  if (errors) {
    const failedItems = items?.filter((item) => item.index?.error);
    console.error(`[ES] Bulk index had ${failedItems?.length} errors`);
    failedItems?.slice(0, 3).forEach((item) => {
      console.error(`  -> ${item.index?._id}: ${item.index?.error?.reason}`);
    });
  }

  const indexedCount = items?.filter((item) => !item.index?.error).length || 0;
  console.log(`[ES] Bulk indexed ${indexedCount}/${listings.length} listings`);
  return indexedCount;
}

/**
 * Full reindex: fetch all active listings from DB and bulk-index them.
 * If fresh=true, delete and recreate the index first.
 */
export async function reindexAll(fresh = false): Promise<number> {
  if (fresh) {
    await deleteIndex();
  }
  await createIndex();

  const batchSize = 200;
  let skip = 0;
  let totalIndexed = 0;

  while (true) {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        model: { select: { id: true, name: true, slug: true } },
        seller: {
          select: {
            id: true,
            name: true,
            sellerProfile: { select: { companyName: true, isVerified: true } },
          },
        },
        images: {
          take: 1,
          orderBy: { position: "asc" },
          select: { thumbnailUrl: true, mediumUrl: true },
        },
      },
      skip,
      take: batchSize,
      orderBy: { createdAt: "asc" },
    });

    if (listings.length === 0) break;

    const indexed = await bulkIndex(listings);
    totalIndexed += indexed;
    skip += batchSize;

    console.log(`[ES] Reindex progress: ${totalIndexed} listings indexed so far...`);
  }

  console.log(`[ES] Reindex complete: ${totalIndexed} total listings indexed.`);
  return totalIndexed;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  model?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  emissionClass?: string;
  countryCode?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  listings: any[];
  total: number;
  aggregations: {
    categories: { slug: string; name: string; count: number }[];
    brands: { slug: string; name: string; count: number }[];
    conditions: { value: string; count: number }[];
    fuelTypes: { value: string; count: number }[];
    countries: { value: string; count: number }[];
    priceRanges: { key: string; from: number; to?: number; count: number }[];
    yearRanges: { key: string; from: number; to?: number; count: number }[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Execute a full-text search with filters, sorting, pagination, and aggregations.
 */
export async function search(params: SearchParams): Promise<SearchResult> {
  const {
    q,
    category,
    brand,
    model,
    condition,
    fuelType,
    transmission,
    emissionClass,
    countryCode,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
    sort = "relevance",
    page = 1,
    limit = 20,
  } = params;

  // Build bool query
  const must: any[] = [];
  const filter: any[] = [
    { term: { status: "ACTIVE" } },
  ];

  // Full-text keyword search
  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: [
          "title^3",
          "title.autocomplete^1",
          "brandName^2",
          "modelName^2",
          "description",
          "categoryName",
          "sellerCompany",
        ],
        type: "best_fields",
        fuzziness: "AUTO",
      },
    });
  }

  // Filters
  if (category) filter.push({ term: { categorySlug: category } });
  if (brand) filter.push({ term: { brandSlug: brand } });
  if (model) filter.push({ term: { modelSlug: model } });
  if (condition) filter.push({ term: { condition } });
  if (fuelType) filter.push({ term: { fuelType } });
  if (transmission) filter.push({ term: { transmission } });
  if (emissionClass) filter.push({ term: { emissionClass } });
  if (countryCode) filter.push({ term: { countryCode } });

  // Range filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    const range: any = {};
    if (minPrice !== undefined) range.gte = minPrice;
    if (maxPrice !== undefined) range.lte = maxPrice;
    filter.push({ range: { price: range } });
  }
  if (minYear !== undefined || maxYear !== undefined) {
    const range: any = {};
    if (minYear !== undefined) range.gte = minYear;
    if (maxYear !== undefined) range.lte = maxYear;
    filter.push({ range: { year: range } });
  }
  if (minMileage !== undefined || maxMileage !== undefined) {
    const range: any = {};
    if (minMileage !== undefined) range.gte = minMileage;
    if (maxMileage !== undefined) range.lte = maxMileage;
    filter.push({ range: { mileageKm: range } });
  }

  // Sorting
  let sortClause: any[];
  switch (sort) {
    case "price_asc":
      sortClause = [{ price: "asc" }, "_score"];
      break;
    case "price_desc":
      sortClause = [{ price: "desc" }, "_score"];
      break;
    case "date_desc":
      sortClause = [{ publishedAt: "desc" }, "_score"];
      break;
    case "date_asc":
      sortClause = [{ publishedAt: "asc" }, "_score"];
      break;
    case "year_desc":
      sortClause = [{ year: "desc" }, "_score"];
      break;
    case "year_asc":
      sortClause = [{ year: "asc" }, "_score"];
      break;
    case "relevance":
    default:
      // Boost featured listings, then by score, then by date
      sortClause = [
        { isFeatured: { order: "desc" } },
        "_score",
        { publishedAt: "desc" },
      ];
      break;
  }

  const from = (page - 1) * limit;

  const response = await esClient.search({
    index: INDEX_NAME,
    from,
    size: limit,
    query: {
      bool: {
        must: must.length > 0 ? must : [{ match_all: {} }],
        filter,
      },
    },
    sort: sortClause,
    aggs: {
      categories: {
        terms: { field: "categorySlug", size: 20 },
        aggs: { name: { terms: { field: "categoryName.keyword", size: 1 } } },
      },
      brands: {
        terms: { field: "brandSlug", size: 50 },
        aggs: { name: { terms: { field: "brandName.keyword", size: 1 } } },
      },
      conditions: {
        terms: { field: "condition", size: 10 },
      },
      fuelTypes: {
        terms: { field: "fuelType", size: 20 },
      },
      countries: {
        terms: { field: "countryCode", size: 30 },
      },
      priceRanges: {
        range: {
          field: "price",
          ranges: [
            { key: "0-5000", from: 0, to: 5000 },
            { key: "5000-15000", from: 5000, to: 15000 },
            { key: "15000-30000", from: 15000, to: 30000 },
            { key: "30000-50000", from: 30000, to: 50000 },
            { key: "50000-100000", from: 50000, to: 100000 },
            { key: "100000+", from: 100000 },
          ],
        },
      },
      yearRanges: {
        range: {
          field: "year",
          ranges: [
            { key: "Before 2010", to: 2010 },
            { key: "2010-2015", from: 2010, to: 2016 },
            { key: "2016-2020", from: 2016, to: 2021 },
            { key: "2021-2023", from: 2021, to: 2024 },
            { key: "2024+", from: 2024 },
          ],
        },
      },
    },
  });

  // Extract hits
  const hits = response.hits.hits;
  const total =
    typeof response.hits.total === "number"
      ? response.hits.total
      : (response.hits.total as any)?.value || 0;

  const listings = hits.map((hit: any) => ({
    ...hit._source,
    _score: hit._score,
  }));

  // Extract aggregations
  const aggs = response.aggregations as any;

  const categories = (aggs?.categories?.buckets || []).map((b: any) => ({
    slug: b.key,
    name: b.name?.buckets?.[0]?.key || b.key,
    count: b.doc_count,
  }));

  const brands = (aggs?.brands?.buckets || []).map((b: any) => ({
    slug: b.key,
    name: b.name?.buckets?.[0]?.key || b.key,
    count: b.doc_count,
  }));

  const conditions = (aggs?.conditions?.buckets || []).map((b: any) => ({
    value: b.key,
    count: b.doc_count,
  }));

  const fuelTypes = (aggs?.fuelTypes?.buckets || []).map((b: any) => ({
    value: b.key,
    count: b.doc_count,
  }));

  const countries = (aggs?.countries?.buckets || []).map((b: any) => ({
    value: b.key,
    count: b.doc_count,
  }));

  const priceRanges = (aggs?.priceRanges?.buckets || []).map((b: any) => ({
    key: b.key,
    from: b.from,
    to: b.to,
    count: b.doc_count,
  }));

  const yearRanges = (aggs?.yearRanges?.buckets || []).map((b: any) => ({
    key: b.key,
    from: b.from,
    to: b.to,
    count: b.doc_count,
  }));

  return {
    listings,
    total,
    aggregations: {
      categories,
      brands,
      conditions,
      fuelTypes,
      countries,
      priceRanges,
      yearRanges,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ---------------------------------------------------------------------------
// Autocomplete Suggestions
// ---------------------------------------------------------------------------

/**
 * Return up to `maxResults` autocomplete suggestions for the given query.
 */
export async function suggestions(
  q: string,
  maxResults = 8
): Promise<string[]> {
  const response = await esClient.search({
    index: INDEX_NAME,
    size: maxResults * 2, // fetch extras for dedup
    query: {
      bool: {
        must: [
          {
            match: {
              "title.autocomplete": {
                query: q,
              },
            },
          },
        ],
        filter: [{ term: { status: "ACTIVE" } }],
      },
    },
    _source: ["title"],
    sort: ["_score", { isFeatured: "desc" }],
  });

  // Deduplicate titles
  const seen = new Set<string>();
  const results: string[] = [];

  for (const hit of response.hits.hits) {
    const title = (hit._source as any)?.title;
    if (!title) continue;
    const lower = title.toLowerCase();
    if (!seen.has(lower) && results.length < maxResults) {
      seen.add(lower);
      results.push(title);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Export all
// ---------------------------------------------------------------------------
export const elasticsearchService = {
  createIndex,
  deleteIndex,
  indexListing,
  removeListing,
  bulkIndex,
  reindexAll,
  search,
  suggestions,
};
