'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Calendar, Mail, Newspaper, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

type NavLink = {
  name: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const navLinks: NavLink[] = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'CIGARS', href: '/cigars', icon: BookOpen },
  { name: 'SIGNATURE', href: '/our-signature', icon: Award },
  { name: 'EVENTS', href: '/news-and-events?filter=Events', icon: Calendar },
  { name: 'NEWS', href: '/news-and-events?filter=News', icon: Newspaper },
  { name: 'CONTACT', href: '/contact', icon: Mail },
];

const bottomNavLinks: NavLink[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Cigars', href: '/cigars', icon: BookOpen },
  { name: 'Signature', href: '/our-signature', icon: Award },
  { name: 'Events', href: '/news-and-events?filter=Events', icon: Calendar },
  { name: 'News', href: '/news-and-events?filter=News', icon: Newspaper },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function Navigation() {
  return (
    <Suspense>
      <NavigationInner />
    </Suspense>
  );
}

function NavigationInner() {
  const [scrollState, setScrollState] = useState<'top' | 'mid' | 'solid'>('top');
  const pathname = usePathname();

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
                <NavLinkItem key={link.name} link={link} pathname={pathname} />
              ))}
            </div>

            {/* Reserve CTA (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/reserve">
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
  const searchParams = useSearchParams();
  const [linkPath, linkQuery] = link.href.split('?');
  const linkFilter = linkQuery ? new URLSearchParams(linkQuery).get('filter') : null;
  const currentFilter = searchParams.get('filter');

  const isActive = linkFilter
    ? pathname === linkPath && currentFilter === linkFilter
    : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

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

function MobileBottomNav({ links, pathname }: { links: NavLink[]; pathname: string }) {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter');
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
            const [linkPath, linkQuery] = link.href.split('?');
            const linkFilter = linkQuery ? new URLSearchParams(linkQuery).get('filter') : null;
            const isActive = linkFilter
              ? pathname === linkPath && currentFilter === linkFilter
              : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

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
