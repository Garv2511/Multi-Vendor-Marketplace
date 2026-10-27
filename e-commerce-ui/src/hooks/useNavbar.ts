'use client';

import { useState, useCallback, useTransition } from 'react';
import { usePathname } from 'next/navigation';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'catalog', label: 'CATALOG', href: '/' },
  { id: 'collections', label: 'COLLECTIONS', href: '/collections' },
  { id: 'journal', label: 'JOURNAL', href: '/journal' },
  { id: 'admin', label: 'ADMIN', href: '/admin' },
];

export function useNavbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [, startTransition] = useTransition();

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return {
    pathname,
    navItems: NAV_ITEMS,
    searchQuery,
    isSearchOpen,
    isMobileMenuOpen,
    cartCount,
    handleSearchChange,
    toggleSearch,
    toggleMobileMenu,
    closeMobileMenu,
  };
}
