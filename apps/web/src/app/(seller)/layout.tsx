'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { SellerSidebar } from '@/components/layout/seller-sidebar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login?redirect=/seller');
      return;
    }

    if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
      router.replace('/');
      return;
    }
  }, [mounted, isAuthenticated, isLoading, user, router]);

  // Show loading state while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authorized
  if (!isAuthenticated || !user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              Seller Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name}
            </span>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
