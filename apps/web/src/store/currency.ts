import { create } from 'zustand';
import { api } from '@/lib/api';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, CURRENCY_INFO } from '@menontrucks/shared';

type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

interface CurrencyState {
  selectedCurrency: SupportedCurrency;
  rates: Record<string, number>;
  lastFetched: number | null;
  setSelectedCurrency: (currency: SupportedCurrency) => void;
  fetchRates: () => Promise<void>;
  convert: (amount: number, fromCurrency: string) => number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getStoredCurrency(): SupportedCurrency {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY as SupportedCurrency;
  const stored = localStorage.getItem('selectedCurrency');
  if (stored && (SUPPORTED_CURRENCIES as readonly string[]).includes(stored)) {
    return stored as SupportedCurrency;
  }
  return DEFAULT_CURRENCY as SupportedCurrency;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  selectedCurrency: getStoredCurrency(),
  rates: { USD: 1 },
  lastFetched: null,

  setSelectedCurrency: (currency) => {
    localStorage.setItem('selectedCurrency', currency);
    set({ selectedCurrency: currency });
  },

  fetchRates: async () => {
    const { lastFetched } = get();
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

    try {
      const res = await api.get<{ success: boolean; data: { base: string; rates: Record<string, number> } }>('/exchange-rates');
      if (res.data?.rates) {
        set({ rates: res.data.rates, lastFetched: Date.now() });
      }
    } catch {
      // Keep existing rates
    }
  },

  convert: (amount, fromCurrency) => {
    const { rates, selectedCurrency } = get();
    if (fromCurrency === selectedCurrency) return amount;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[selectedCurrency] || 1;
    // Convert from source to USD, then from USD to target
    return (amount / fromRate) * toRate;
  },
}));

export { CURRENCY_INFO, SUPPORTED_CURRENCIES };
export type { SupportedCurrency };
