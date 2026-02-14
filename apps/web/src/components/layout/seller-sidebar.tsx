'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  Plus,
  MessageSquare,
  Star,
  Building,
  CreditCard,
  BarChart3,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';

interface SellerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: SidebarNavItem[] = [
  { label: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { label: 'My Listings', href: '/seller/listings', icon: List },
  { label: 'Add Listing', href: '/seller/listings/new', icon: Plus },
  { label: 'Messages', href: '/seller/messages', icon: MessageSquare, badge: 5 },
  { label: 'Reviews', href: '/seller/reviews', icon: Star },
  { label: 'Company Profile', href: '/seller/profile', icon: Building },
  { label: 'Subscription', href: '/seller/subscription', icon: CreditCard },
  { label: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
];

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#1E3A5F] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <Link href="/seller" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
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
            <span className="text-lg font-bold">MenonTrucks</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/seller' && pathname?.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="bg-accent text-white border-0 text-[10px] h-5 min-w-[20px] justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function SellerSidebarToggle({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
