import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function LoadingSpinner({ size, className, ...props }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { LoadingSpinner };
export type { LoadingSpinnerProps };
