'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

function StarRating({ value, onChange, size = 'md', className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const isInteractive = !!onChange;
  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;

        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => isInteractive && setHoverValue(star)}
            onMouseLeave={() => isInteractive && setHoverValue(null)}
            className={cn(
              'inline-flex items-center justify-center transition-colors',
              isInteractive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default',
              'disabled:cursor-default focus:outline-none'
            )}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled
                  ? 'fill-accent text-accent'
                  : 'fill-none text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating };
export type { StarRatingProps };
