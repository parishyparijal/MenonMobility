import * as React from 'react';
import { cn } from '@/lib/utils';

type SupportedCurrency = 'EUR' | 'GBP' | 'USD';

const currencyLocaleMap: Record<SupportedCurrency, string> = {
  EUR: 'de-DE',
  GBP: 'en-GB',
  USD: 'en-US',
};

interface CurrencyDisplayProps {
  amount: number;
  currency?: SupportedCurrency;
  showDecimals?: boolean;
  className?: string;
}

function CurrencyDisplay({
  amount,
  currency = 'EUR',
  showDecimals = true,
  className,
}: CurrencyDisplayProps) {
  const formatted = React.useMemo(() => {
    const locale = currencyLocaleMap[currency];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);
  }, [amount, currency, showDecimals]);

  return (
    <span className={cn('tabular-nums', className)}>
      {formatted}
    </span>
  );
}

export { CurrencyDisplay };
export type { CurrencyDisplayProps, SupportedCurrency };
