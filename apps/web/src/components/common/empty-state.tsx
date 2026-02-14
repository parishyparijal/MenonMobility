import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps, EmptyStateAction };
