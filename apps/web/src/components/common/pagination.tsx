'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  // Show pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
          'hover:bg-muted disabled:pointer-events-none disabled:opacity-50'
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary text-white'
                : 'hover:bg-muted text-foreground'
            )}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
          'hover:bg-muted disabled:pointer-events-none disabled:opacity-50'
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
