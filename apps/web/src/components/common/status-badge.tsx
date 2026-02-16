import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ListingStatus =
  | 'ACTIVE'
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'SOLD'
  | 'EXPIRED'
  | 'REJECTED'
  | 'ARCHIVED';

const statusConfig: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  PENDING_REVIEW: {
    label: 'Pending Review',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  SOLD: {
    label: 'Sold',
    className: 'bg-primary-50 text-primary border-primary-200',
  },
  EXPIRED: {
    label: 'Expired',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
};

interface StatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

export { StatusBadge };
export type { StatusBadgeProps, ListingStatus };
