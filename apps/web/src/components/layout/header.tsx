'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  Bell,
  Menu,
  Phone,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  List,
  MessageSquare,
  UserCircle,
  Shield,
  Clock,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLocalizedText } from '@/lib/i18n-helpers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { MobileNav } from './mobile-nav';
import { api } from '@/lib/api';

interface SiteLanguage {
  id: string;
  code: string;
  name: string;
  localName: string;
  countryCode: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

// Fallback languages in case API is unavailable
const fallbackLanguages: SiteLanguage[] = [
  { id: '1', code: 'en', name: 'English', localName: 'International | English', countryCode: 'eu', isDefault: true, isActive: true, sortOrder: 0 },
  { id: '2', code: 'nl-BE', name: 'Nederlands', localName: 'België | Nederlands', countryCode: 'be', isDefault: false, isActive: true, sortOrder: 1 },
  { id: '3', code: 'de', name: 'Deutsch', localName: 'Deutschland | Deutsch', countryCode: 'de', isDefault: false, isActive: true, sortOrder: 2 },
];

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  brands?: string[];
}

// Fallback navItems in case API is unavailable
const fallbackNavItems: NavItem[] = [
  {
    label: 'Trucks',
    href: '/trucks',
    children: [
      { label: 'All Trucks', href: '/trucks' },
      { label: 'Tractor Units', href: '/search?category=trucks&subcategory=tractor-units' },
      { label: 'Box Trucks', href: '/search?category=trucks&subcategory=box-trucks' },
      { label: 'Flatbed Trucks', href: '/search?category=trucks&subcategory=flatbed' },
      { label: 'Refrigerated', href: '/search?category=trucks&subcategory=refrigerated' },
      { label: 'Tipper Trucks', href: '/search?category=trucks&subcategory=tipper' },
      { label: 'Tanker Trucks', href: '/search?category=trucks&subcategory=tanker' },
      { label: 'Curtainside', href: '/search?category=trucks&subcategory=curtainside' },
    ],
    brands: ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Renault'],
  },
  {
    label: 'Trailers',
    href: '/trailers',
    children: [
      { label: 'All Trailers', href: '/trailers' },
      { label: 'Semi Trailers', href: '/search?category=trailers&subcategory=semi' },
      { label: 'Flatbed Trailers', href: '/search?category=trailers&subcategory=flatbed' },
      { label: 'Refrigerated', href: '/search?category=trailers&subcategory=refrigerated' },
      { label: 'Curtain Side', href: '/search?category=trailers&subcategory=curtain-side' },
      { label: 'Low Loaders', href: '/search?category=trailers&subcategory=low-loaders' },
    ],
    brands: ['Schmitz Cargobull', 'Krone', 'Wielton', 'Lamberet'],
  },
  {
    label: 'Equipment',
    href: '/construction',
    children: [
      { label: 'All Equipment', href: '/construction' },
      { label: 'Excavators', href: '/search?category=construction&subcategory=excavators' },
      { label: 'Wheel Loaders', href: '/search?category=construction&subcategory=wheel-loaders' },
      { label: 'Cranes', href: '/search?category=construction&subcategory=cranes' },
      { label: 'Bulldozers', href: '/search?category=construction&subcategory=bulldozers' },
      { label: 'Dump Trucks', href: '/search?category=construction&subcategory=dump-trucks' },
    ],
    brands: ['Caterpillar', 'Komatsu', 'Liebherr', 'Volvo CE', 'JCB'],
  },
  {
    label: 'Vans',
    href: '/vans',
    children: [
      { label: 'All Vans', href: '/vans' },
      { label: 'Cargo Vans', href: '/search?category=vans&subcategory=cargo' },
      { label: 'Passenger Vans', href: '/search?category=vans&subcategory=passenger' },
      { label: 'Box Vans', href: '/search?category=vans&subcategory=box' },
    ],
    brands: ['Mercedes-Benz', 'Ford', 'Volkswagen', 'Iveco', 'Renault'],
  },
  { label: 'Cars', href: '/cars' },
  { label: 'Containers', href: '/containers' },
  { label: 'Parts', href: '/parts' },
];

interface ApiCategory {
  id: string;
  name: unknown;
  slug: string;
  children?: ApiCategory[];
}

function buildNavItemsFromApi(categories: ApiCategory[]): NavItem[] {
  return categories.map((cat) => {
    const label = getLocalizedText(cat.name);
    const href = `/${cat.slug}`;
    const item: NavItem = { label, href };

    if (cat.children && cat.children.length > 0) {
      item.children = [
        { label: `All ${label}`, href },
        ...cat.children.map((child) => ({
          label: getLocalizedText(child.name),
          href: `/search?category=${cat.slug}&subcategory=${child.slug}`,
        })),
      ];
    }

    return item;
  });
}

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(fallbackNavItems);
  const [languages, setLanguages] = useState<SiteLanguage[]>(fallbackLanguages);
  const [selectedLang, setSelectedLang] = useState<SiteLanguage>(fallbackLanguages[0]);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const favoritesCount = 0;
  const unreadMessages = 3;

  // Fetch categories from API for dynamic nav
  useEffect(() => {
    api.get<{ success: boolean; data: ApiCategory[] }>('/categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setNavItems(buildNavItemsFromApi(res.data));
        }
      })
      .catch(() => {
        // Keep fallback nav items
      });
  }, []);

  // Fetch languages from API
  useEffect(() => {
    api.get<{ success: boolean; data: SiteLanguage[] }>('/languages')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLanguages(res.data);
          const defaultLang = res.data.find((l) => l.isDefault) || res.data[0];
          setSelectedLang(defaultLang);
        }
      })
      .catch(() => {
        // Keep fallback languages
      });
  }, []);

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
                <img
                  src={`https://flagcdn.com/w40/${selectedLang.countryCode}.png`}
                  alt={selectedLang.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{selectedLang.code.split('-')[0].toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-border z-50 py-2 min-w-[240px] max-h-[400px] overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors',
                        selectedLang.code === lang.code && 'bg-muted font-medium'
                      )}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                        alt={lang.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span>{lang.localName}</span>
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
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Menon Mobility"
              className="h-10 md:h-12 w-auto object-contain"
            />
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

                {/* Mega Menu Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-xl border border-border z-50 p-5 min-w-[420px]"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="flex gap-6">
                      {/* Subcategories */}
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Categories
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-1.5 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Top Brands */}
                      {item.brands && item.brands.length > 0 && (
                        <div className="w-40 border-l border-border pl-5">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Top Brands
                          </h4>
                          <div className="space-y-1">
                            {item.brands.map((brand) => (
                              <Link
                                key={brand}
                                href={`/search?brand=${encodeURIComponent(brand)}`}
                                className="block py-1.5 text-sm text-foreground hover:text-accent transition-colors"
                              >
                                {brand}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-border mt-4 pt-3">
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-primary hover:text-accent transition-colors"
                      >
                        View all {item.label.toLowerCase()} &rarr;
                      </Link>
                    </div>
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

            {/* Notifications Bell */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative hidden sm:flex" asChild>
                <Link href="/notifications">
                  <Bell className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full" />
                  )}
                </Link>
              </Button>
            )}

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
                        href="/seller"
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
                      href="/recently-viewed"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Recently Viewed
                    </Link>

                    <Link
                      href="/saved-searches"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                      Saved Searches
                    </Link>

                    <Link
                      href="/notifications"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
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
