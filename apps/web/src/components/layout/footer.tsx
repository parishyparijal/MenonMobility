import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  transport: {
    title: 'Transport',
    links: [
      { label: 'Trucks', href: '/trucks' },
      { label: 'Trailers', href: '/trailers' },
      { label: 'Tractor Units', href: '/trucks?type=tractor' },
      { label: 'Semi Trailers', href: '/trailers?type=semi' },
    ],
  },
  equipment: {
    title: 'More Vehicles',
    links: [
      { label: 'Construction', href: '/construction' },
      { label: 'Vans', href: '/vans' },
      { label: 'Cars', href: '/cars' },
      { label: 'Parts & Accessories', href: '/parts' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  support: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Sell Your Vehicle', href: '/register' },
      { label: 'Advertise', href: '/contact' },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/menontrucks', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/menontrucks', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/menontrucks', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/menontrucks', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Menon Mobility"
                className="h-12 w-auto object-contain bg-white rounded-lg px-2 py-1"
              />
            </Link>
            <p className="text-sm text-white/70 mb-6 max-w-[240px]">
              Europe&apos;s trusted marketplace for commercial vehicles, trucks,
              trailers, and heavy equipment.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Menon Mobility. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-sm text-white/50 hover:text-white transition-colors">
              EN
            </button>
            <span className="text-white/20">|</span>
            <button className="text-sm text-white/50 hover:text-white transition-colors">
              NL
            </button>
            <span className="text-white/20">|</span>
            <button className="text-sm text-white/50 hover:text-white transition-colors">
              DE
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
