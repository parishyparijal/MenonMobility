'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  Users,
  FolderTree,
  Tags,
  Star,
  Megaphone,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  X,
  Menu,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';

interface AdminSidebarProps {
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
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Listings', href: '/admin/listings', icon: List, badge: 12 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Brands', href: '/admin/brands', icon: Tags },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Ads', href: '/admin/ads', icon: Megaphone },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
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
          'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-800 to-primary-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <img
              src="/logo-white.png"
              alt="Menon Mobility"
              className="h-9 w-auto object-contain"
            />
            <span className="text-[10px] uppercase tracking-wider text-white font-semibold bg-gradient-to-r from-accent-400 to-accent-600 px-1.5 py-0.5 rounded shadow-sm">
              Admin
            </span>
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
                (item.href !== '/admin' && pathname?.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="bg-gradient-to-b from-accent-400 to-accent-600 text-white border border-accent-300/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-[10px] h-5 min-w-[20px] justify-center">
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

export function AdminSidebarToggle({
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
