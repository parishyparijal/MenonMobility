'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  ChevronDown,
  ChevronRight,
  Heart,
  LogOut,
  LayoutDashboard,
  List,
  MessageSquare,
  UserCircle,
  Shield,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const unreadMessages = 3;

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function toggleSection(label: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v12" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
            </div>
            <span className="text-lg font-bold text-primary">MenonTrucks</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <Link
            href="/search"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 bg-muted rounded-lg text-sm text-muted-foreground"
          >
            <Search className="w-4 h-4" />
            Search vehicles...
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={cn(
                      'flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'text-primary bg-primary-50'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span>{item.label}</span>
                    {expandedSections.has(item.label) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSections.has(item.label) && (
                    <div className="bg-muted/50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block px-8 py-2.5 text-sm text-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary bg-primary-50'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Authenticated Nav Items */}
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                <Link
                  href="/seller/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <List className="w-4 h-4" />
                  My Listings
                </Link>
              )}

              <Link
                href="/favorites"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Heart className="w-4 h-4" />
                Favorites
              </Link>

              <Link
                href="/messages"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
                {unreadMessages > 0 && (
                  <Badge variant="danger" className="ml-auto text-[10px] h-5">
                    {unreadMessages}
                  </Badge>
                )}
              </Link>

              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>

              {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link
                    href="/seller"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-accent-700 hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Seller Dashboard
                  </Link>
                </>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-muted transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/list-vehicle"
                onClick={onClose}
                className="block px-4 py-3 text-sm font-medium text-accent-700 hover:bg-muted transition-colors"
              >
                List your vehicle
              </Link>
            </>
          )}
        </div>

        {/* Bottom Auth Section */}
        <div className="border-t border-border p-4 space-y-2">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" className="w-full" asChild>
                <Link href="/login" onClick={onClose}>
                  Login
                </Link>
              </Button>
              <Button variant="accent" className="w-full" asChild>
                <Link href="/register" onClick={onClose}>
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
