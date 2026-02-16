import redis from "@/config/redis";

const CACHE_KEY = "exchange_rates:usd";
const CACHE_TTL = 3600; // 1 hour

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  JPY: 149.5,
  GBP: 0.79,
  CNY: 7.24,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  HKD: 7.82,
  SGD: 1.34,
};

interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
  time_last_update_utc?: string;
}

export async function getExchangeRates(): Promise<Record<string, number>> {
  // Try cache first
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Redis unavailable, continue to fetch
  }

  // Fetch from API
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ExchangeRateResponse;

    // Filter to only supported currencies
    const supported = ["USD", "EUR", "JPY", "GBP", "CNY", "AUD", "CAD", "CHF", "HKD", "SGD"];
    const rates: Record<string, number> = {};
    for (const code of supported) {
      rates[code] = data.rates[code] ?? FALLBACK_RATES[code];
    }

    // Cache in Redis
    try {
      await redis.set(CACHE_KEY, JSON.stringify(rates), "EX", CACHE_TTL);
    } catch {
      // Redis unavailable, still return rates
    }

    return rates;
  } catch {
    // API down, return fallback
    return FALLBACK_RATES;
  }
}
