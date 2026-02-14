import { Skeleton } from '@/components/ui/skeleton';

interface ListingCardSkeletonProps {
  view?: 'grid' | 'list';
}

export function ListingCardSkeleton({ view = 'grid' }: ListingCardSkeletonProps) {
  if (view === 'list') {
    return (
      <div className="flex gap-4 bg-white rounded-xl border border-border p-3">
        <Skeleton className="w-64 h-44 rounded-lg flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-3 mt-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-32 mt-3" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
