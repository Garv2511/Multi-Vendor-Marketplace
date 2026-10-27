'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Heart,
  Bag,
  List,
  X,
  PersonCircle,
} from 'react-bootstrap-icons';
import { useNavbar } from '@/hooks/useNavbar';

export const Navbar: React.FC = () => {
  const {
    pathname,
    navItems,
    searchQuery,
    isSearchOpen,
    isMobileMenuOpen,
    cartCount,
    handleSearchChange,
    toggleSearch,
    toggleMobileMenu,
    closeMobileMenu,
  } = useNavbar();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcfcfb] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Monogram & Name */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label="Atelier Home"
            >
              {/* Atelier Geometric Logo Glyph */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 border border-neutral-300 bg-white flex items-center justify-center p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] group-hover:border-neutral-900 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-full h-full text-neutral-800"
                  aria-hidden="true"
                >
                  <polygon points="12 3 3 20 21 20" />
                  <line x1="7" y1="14" x2="17" y2="14" />
                  <circle cx="12" cy="11" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-semibold text-sm sm:text-base tracking-[0.22em] text-neutral-900">
                ATELIER
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center space-x-7 text-xs font-semibold tracking-[0.18em]"
              aria-label="Main Navigation"
            >
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/' || pathname.startsWith('/catalog')
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative py-2 transition-colors duration-150 ${
                      isActive
                        ? 'text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Wishlist, Cart & Account */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            
            {/* Search Tool */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-neutral-300 px-3 py-1.5 shadow-inner">
                  <Search className="w-3.5 h-3.5 text-neutral-500 mr-2 shrink-0" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="SEARCH CATALOG..."
                    className="w-32 sm:w-48 text-[11px] tracking-wider uppercase bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
                    autoFocus
                  />
                  <button
                    onClick={toggleSearch}
                    aria-label="Close search input"
                    className="ml-1 text-neutral-400 hover:text-neutral-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="group flex items-center gap-2 py-1.5 px-2 text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
                  aria-label="Open catalog search"
                >
                  <Search className="w-4 h-4 text-neutral-700 group-hover:scale-105 transition-transform" />
                  <span className="hidden lg:inline text-[11px] font-semibold tracking-[0.16em] uppercase">
                    SEARCH CATALOG
                  </span>
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-1.5 text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label="View saved wishlist"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="relative p-1.5 text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <Bag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Link / Avatar */}
            <Link
              href="/auth/login"
              className="flex items-center gap-2 pl-1 group focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label="Account Login or Profile"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-neutral-300 bg-neutral-200 flex items-center justify-center shadow-sm group-hover:border-neutral-900 transition-colors">
                {/* Chic monochrome avatar silhouette portrait */}
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                >
                  <rect width="36" height="36" fill="#dedbd6" />
                  <circle cx="18" cy="13" r="5.5" fill="#4a4845" />
                  <path
                    d="M7 32C7 26.5 12 22 18 22C24 22 29 26.5 29 32"
                    fill="#2a2825"
                  />
                  {/* Subtle editorial coat lapel lines */}
                  <line x1="18" y1="22" x2="15" y2="29" stroke="#dedbd6" strokeWidth="0.8" />
                  <line x1="18" y1="22" x2="21" y2="29" stroke="#dedbd6" strokeWidth="0.8" />
                </svg>
              </div>
              <span className="hidden sm:inline text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-800 group-hover:text-neutral-950">
                ACCOUNT
              </span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-1.5 text-neutral-700 hover:text-neutral-950 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-5 pt-4 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-xs font-semibold tracking-[0.18em]">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname.startsWith('/catalog')
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`py-2 px-2 border-l-2 transition-colors ${
                    isActive
                      ? 'border-black text-black bg-neutral-50'
                      : 'border-transparent text-neutral-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/auth/login"
              onClick={closeMobileMenu}
              className="py-2 px-2 border-l-2 border-transparent text-neutral-600 hover:text-black flex items-center gap-2"
            >
              <PersonCircle className="w-4 h-4" />
              <span>VAULT AUTHENTICATION / LOGIN</span>
            </Link>
            <Link
              href="/auth/signup"
              onClick={closeMobileMenu}
              className="py-2 px-2 border-l-2 border-transparent text-neutral-600 hover:text-black"
            >
              REQUEST CLIENT MEMBERSHIP
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
