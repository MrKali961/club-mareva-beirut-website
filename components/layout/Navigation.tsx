'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Calendar, Mail, ChevronRight, Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type NavLink = {
  name: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  hasMegaMenu?: boolean;
};

const navLinks: NavLink[] = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'CIGARS', href: '/cigars', icon: BookOpen, hasMegaMenu: true },
  { name: 'EVENTS', href: '/news-and-events', icon: Calendar, hasMegaMenu: true },
  { name: 'CONTACT', href: '/contact', icon: Mail },
];

const bottomNavLinks: NavLink[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Cigars', href: '/cigars', icon: BookOpen },
  { name: 'Events', href: '/news-and-events', icon: Calendar },
  { name: 'Contact', href: '/contact', icon: Mail },
];

// Mega menu content
const megaMenuContent = {
  CIGARS: {
    featured: {
      title: 'Our Humidor',
      description: '220+ premium varieties from around the world',
      image: '/images/clubmarevabeirut/2025/ANGELO20251114-L0034.jpg',
    },
    links: [
      { name: 'Habanos (Cuba)', href: '/cigars' },
      { name: 'Davidoff', href: '/cigars' },
      { name: 'Drew Estate', href: '/cigars' },
      { name: 'View All Brands', href: '/cigars', featured: true },
    ],
  },
  EVENTS: {
    featured: {
      title: 'News & Events',
      description: 'Exclusive tastings and members-only gatherings',
      image: '/images/clubmarevabeirut/2023/Pictures-4.jpg',
    },
    links: [
      { name: 'Latest News', href: '/news-and-events' },
      { name: 'Tasting Events', href: '/news-and-events' },
      { name: 'Special Occasions', href: '/news-and-events' },
      { name: 'View All Events', href: '/news-and-events', featured: true },
    ],
  },
};

// Animation variants
const megaMenuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const megaMenuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.08, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const mobileNavLinkVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Navigation() {
  const [scrollState, setScrollState] = useState<'top' | 'mid' | 'solid'>('top');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY <= 20) {
        setScrollState('top');
      } else if (scrollY <= 100) {
        setScrollState('mid');
      } else {
        setScrollState('solid');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleMegaMenuEnter = (menuName: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(menuName);
    }, 150);
  };

  const handleMegaMenuLeave = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300);
  };

  return (
    <>
      {/* Main Header Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrollState === 'solid'
            ? 'bg-black/95 backdrop-blur-md border-b border-gold/10'
            : scrollState === 'mid'
            ? 'bg-black/60 backdrop-blur-sm border-b border-transparent'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            {/* Logo with Emblem */}
            <Link
              href="/"
              className="group relative flex items-center"
              aria-label="Club Mareva Home"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/club-mareva-logo-gold.svg"
                  alt="Club Mareva"
                  width={192}
                  height={64}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && handleMegaMenuEnter(link.name)}
                  onMouseLeave={handleMegaMenuLeave}
                  onFocus={() => link.hasMegaMenu && handleMegaMenuEnter(link.name)}
                  onBlur={handleMegaMenuLeave}
                  tabIndex={link.hasMegaMenu ? 0 : undefined}
                  role={link.hasMegaMenu ? "button" : undefined}
                  aria-haspopup={link.hasMegaMenu ? "true" : undefined}
                  aria-expanded={link.hasMegaMenu ? (activeMegaMenu === link.name) : undefined}
                >
                  <NavLinkItem link={link} pathname={pathname} />

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {link.hasMegaMenu && activeMegaMenu === link.name && (
                      <MegaMenu
                        content={megaMenuContent[link.name as keyof typeof megaMenuContent]}
                        onMouseEnter={() => handleMegaMenuEnter(link.name)}
                        onMouseLeave={handleMegaMenuLeave}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Reserve CTA (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-6 py-2.5 bg-gold text-black font-playfair text-xs font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden group"
                >
                  <span className="relative z-10">Reserve</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-cream hover:text-gold transition-colors duration-200 -mr-2"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <FullScreenMobileMenu
            navLinks={navLinks}
            onClose={() => setIsMobileMenuOpen(false)}
            pathname={pathname}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav links={bottomNavLinks} pathname={pathname} />
    </>
  );
}

function NavLinkItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

  const content = (
    <span className={`relative block px-4 py-2 font-playfair text-xs tracking-[0.15em] transition-colors duration-200 ${
      isActive ? 'text-gold' : 'text-cream group-hover:text-gold'
    }`}>
      {link.name}
      <motion.span
        initial={false}
        animate={{ width: isActive ? '100%' : '0%', left: isActive ? '0%' : '50%' }}
        className="absolute bottom-0 h-[1px] bg-gold"
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="absolute bottom-0 left-1/2 h-[1px] w-0 bg-gold transition-all duration-200 ease-out group-hover:w-full group-hover:left-0" />
    </span>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
        aria-label={`${link.name} (opens in new tab)`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className="group relative">
      {content}
    </Link>
  );
}

function MegaMenu({
  content,
  onMouseEnter,
  onMouseLeave,
}: {
  content: {
    featured: { title: string; description: string; image: string };
    links: { name: string; href: string; featured?: boolean }[];
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Escape') onMouseLeave(); }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
    >
      <div className="bg-black/95 backdrop-blur-md border border-gold/20 rounded-sm shadow-2xl min-w-[400px] overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          {/* Featured Image */}
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content.featured.image})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full flex flex-col justify-end p-5">
              <motion.h4
                variants={megaMenuItemVariants}
                className="font-playfair text-lg text-cream mb-1"
              >
                {content.featured.title}
              </motion.h4>
              <motion.p
                variants={megaMenuItemVariants}
                className="font-playfair text-xs text-cream/70"
              >
                {content.featured.description}
              </motion.p>
            </div>
          </div>

          {/* Links */}
          <div className="p-5 space-y-2">
            {content.links.map((link) => (
              <motion.div key={link.name} variants={megaMenuItemVariants}>
                <Link
                  href={link.href}
                  className={`group flex items-center gap-2 py-2 font-playfair text-sm transition-colors duration-200 ${
                    link.featured
                      ? 'text-gold hover:text-gold-light'
                      : 'text-cream/80 hover:text-gold'
                  }`}
                >
                  {link.name}
                  <ChevronRight
                    className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${
                      link.featured ? 'text-gold' : ''
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FullScreenMobileMenu({
  navLinks,
  onClose,
  pathname,
}: {
  navLinks: NavLink[];
  onClose: () => void;
  pathname: string;
}) {
  return (
    <motion.div
      variants={mobileMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Background with image and overlays */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/clubmarevabeirut/2023/Pictures-4.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/90" />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <motion.div
            variants={mobileNavLinkVariants}
            className="flex items-center gap-3"
          >
            <Image
              src="/images/club-mareva-logo-gold.svg"
              alt="Club Mareva"
              width={168}
              height={56}
              className="h-14 w-auto object-contain"
            />
          </motion.div>
          <motion.button
            variants={mobileNavLinkVariants}
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 text-cream hover:text-gold transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={1.5} />
          </motion.button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <motion.div key={link.name} variants={mobileNavLinkVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group block py-4"
                >
                  <span
                    className={`font-playfair text-3xl md:text-4xl font-light tracking-[0.1em] transition-all duration-300 ${
                      isActive
                        ? 'text-gold'
                        : 'text-cream group-hover:text-gold group-hover:tracking-[0.15em]'
                    }`}
                  >
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveUnderline"
                      className="h-px w-full bg-gold mt-2"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          variants={mobileNavLinkVariants}
          className="px-8 py-8 border-t border-gold/20"
        >
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://instagram.com/clubmarevabeirut"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-cream/20 hover:border-gold transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-cream hover:text-gold transition-colors" />
            </a>
            <a
              href="https://facebook.com/clubmarevabeirut"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-cream/20 hover:border-gold transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-cream hover:text-gold transition-colors" />
            </a>
            <span className="w-px h-6 bg-gold/30 mx-2" />
            <a
              href="tel:+96179117997"
              className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="font-playfair text-sm">+961 79 117 997</span>
            </a>
          </div>

          {/* Address */}
          <div className="flex items-center justify-center gap-2 text-cream/50">
            <MapPin className="w-4 h-4" />
            <span className="font-playfair text-xs">Sea Side Rd, Jal El Dib, Beirut</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MobileBottomNav({ links, pathname }: { links: NavLink[]; pathname: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
    >
      <div className="bg-black/95 backdrop-blur-md border-t border-gold/20 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative flex flex-col items-center justify-center py-2 px-4 min-w-[70px] group"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold origin-center"
                />

                {Icon && (
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className={`${
                      isActive ? 'text-gold' : 'text-cream/60 group-hover:text-cream'
                    } transition-colors duration-200`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                  </motion.div>
                )}

                <span className={`mt-1 font-playfair text-[10px] tracking-wider uppercase ${
                  isActive ? 'text-gold' : 'text-cream/50 group-hover:text-cream/70'
                } transition-colors duration-200`}>
                  {link.name}
                </span>

                <span className="absolute inset-0 rounded-lg group-active:bg-gold/10 transition-colors duration-150" />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
