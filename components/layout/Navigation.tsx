'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Calendar, Mail, ChevronRight } from 'lucide-react';
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


export default function Navigation() {
  const [scrollState, setScrollState] = useState<'top' | 'mid' | 'solid'>('top');
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
          <div className="flex h-24 items-center justify-center lg:justify-between">
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

          </div>
        </nav>
      </motion.header>

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
