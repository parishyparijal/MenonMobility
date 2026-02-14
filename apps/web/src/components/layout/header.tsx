'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  Menu,
  Phone,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  List,
  MessageSquare,
  UserCircle,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { MobileNav } from './mobile-nav';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Trucks',
    href: '/trucks',
    children: [
      { label: 'All Trucks', href: '/trucks' },
      { label: 'Box Trucks', href: '/trucks?type=box' },
      { label: 'Flatbed Trucks', href: '/trucks?type=flatbed' },
      { label: 'Refrigerated Trucks', href: '/trucks?type=refrigerated' },
      { label: 'Tractor Units', href: '/trucks?type=tractor' },
    ],
  },
  {
    label: 'Trailers',
    href: '/trailers',
    children: [
      { label: 'All Trailers', href: '/trailers' },
      { label: 'Semi Trailers', href: '/trailers?type=semi' },
      { label: 'Flatbed Trailers', href: '/trailers?type=flatbed' },
      { label: 'Refrigerated Trailers', href: '/trailers?type=refrigerated' },
      { label: 'Curtain Side', href: '/trailers?type=curtain' },
    ],
  },
  {
    label: 'Equipment',
    href: '/equipment',
    children: [
      { label: 'All Equipment', href: '/equipment' },
      { label: 'Construction', href: '/equipment?type=construction' },
      { label: 'Agricultural', href: '/equipment?type=agricultural' },
      { label: 'Forklifts', href: '/equipment?type=forklifts' },
    ],
  },
  {
    label: 'Vans',
    href: '/vans',
    children: [
      { label: 'All Vans', href: '/vans' },
      { label: 'Cargo Vans', href: '/vans?type=cargo' },
      { label: 'Passenger Vans', href: '/vans?type=passenger' },
    ],
  },
  {
    label: 'Cars',
    href: '/cars',
  },
  {
    label: 'Containers',
    href: '/containers',
  },
  {
    label: 'Parts',
    href: '/parts',
  },
];

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'nl', label: 'NL', flag: '🇳🇱' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const favoritesCount = 0;
  const unreadMessages = 3;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDropdownEnter(label: string) {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setActiveDropdown(label);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm">
        <div className="container mx-auto flex items-center justify-between h-10 px-4">
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <span>{selectedLang.flag}</span>
                <span>{selectedLang.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-border z-50 py-1 min-w-[100px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors',
                        selectedLang.code === lang.code && 'bg-muted font-medium'
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/list-vehicle"
              className="hover:text-accent transition-colors font-medium hidden sm:block"
            >
              List your vehicle
            </Link>
            <a
              href="tel:+31201234567"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+31 20 123 4567</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v12" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary">MenonTrucks</span>
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 mx-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href || pathname?.startsWith(item.href + '/')
                      ? 'text-primary bg-primary-50'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-lg border border-border z-50 py-2 min-w-[200px]"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/favorites">
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
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
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-border z-50 py-2 min-w-[220px]">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <List className="w-4 h-4" />
                        My Listings
                      </Link>
                    )}

                    <Link
                      href="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>

                    <Link
                      href="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
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
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Link>

                    {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                      <>
                        <div className="border-t border-border my-1" />
                        <Link
                          href="/seller"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-accent-700 hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Seller Dashboard
                        </Link>
                      </>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
