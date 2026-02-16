'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useCurrencyStore, CURRENCY_INFO } from '@/store/currency';

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  showDecimals?: boolean;
  className?: string;
}

function CurrencyDisplay({
  amount,
  currency = 'USD',
  showDecimals = true,
  className,
}: CurrencyDisplayProps) {
  const { selectedCurrency, convert } = useCurrencyStore();

  const formatted = React.useMemo(() => {
    const converted = convert(amount, currency);
    const info = CURRENCY_INFO[selectedCurrency] || CURRENCY_INFO.USD;
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(converted);
  }, [amount, currency, selectedCurrency, convert, showDecimals]);

  return (
    <span className={cn('tabular-nums', className)}>
      {formatted}
    </span>
  );
}

export { CurrencyDisplay };
export type { CurrencyDisplayProps };
