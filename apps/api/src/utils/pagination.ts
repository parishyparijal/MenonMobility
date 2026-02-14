// ---------------------------------------------------------------------------
// Pagination Utility
// ---------------------------------------------------------------------------

interface PaginationParams {
  page: number;
  perPage: number;
  skip: number;
}

/**
 * Parse pagination parameters from a query object.
 * Defaults: page = 1, perPage = 20, max perPage = 100.
 */
export function parsePagination(
  query: Record<string, unknown>
): PaginationParams {
  let page = parseInt(String(query.page || "1"), 10);
  let perPage = parseInt(String(query.perPage || query.per_page || "20"), 10);

  // Clamp values to sensible ranges
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 20;
  if (perPage > 100) perPage = 100;

  const skip = (page - 1) * perPage;

  return { page, perPage, skip };
}

/**
 * Build pagination metadata for API responses.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  perPage: number
) {
  const totalPages = Math.ceil(total / perPage);
  return {
    total,
    page,
    perPage,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
