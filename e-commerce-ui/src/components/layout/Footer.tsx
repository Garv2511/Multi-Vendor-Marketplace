'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'react-bootstrap-icons';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-[#f9f9f8] border-t border-neutral-200 text-neutral-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Gazette */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="font-semibold text-sm tracking-[0.2em] uppercase text-neutral-900">
              ATELIER
            </h2>
            <p className="text-neutral-600 leading-relaxed text-xs max-w-sm">
              An architectural atelier dedicated to tactile simplicity, intentional curation, and
              limited-edition design objects.
            </p>

            <div className="pt-2">
              <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-2">
                ATELIER GAZETTE
              </span>
              {isSubscribed ? (
                <p className="text-xs text-neutral-700 italic">
                  Dossier enrollment confirmed for rare releases.
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email for rare releases"
                    aria-label="Newsletter email address"
                    required
                    className="flex-1 bg-white border border-neutral-300 px-3 py-2 text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase hover:bg-neutral-800 transition-colors"
                  >
                    JOIN
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Curation */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-[11px] tracking-[0.18em] uppercase text-neutral-900">
              CURATION
            </h3>
            <ul className="space-y-2.5 text-neutral-600 text-xs">
              <li>
                <Link href="/curation/living" className="hover:text-neutral-950 transition-colors">
                  Living & Objects
                </Link>
              </li>
              <li>
                <Link href="/curation/ceramics" className="hover:text-neutral-950 transition-colors">
                  Ceramics & Clay
                </Link>
              </li>
              <li>
                <Link href="/curation/lighting" className="hover:text-neutral-950 transition-colors">
                  Architectural Lighting
                </Link>
              </li>
              <li>
                <Link href="/curation/monographs" className="hover:text-neutral-950 transition-colors">
                  Monographs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Concierge */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-[11px] tracking-[0.18em] uppercase text-neutral-900">
              CONCIERGE
            </h3>
            <ul className="space-y-2.5 text-neutral-600 text-xs">
              <li>
                <Link href="/concierge/orders" className="hover:text-neutral-950 transition-colors">
                  Order Archive
                </Link>
              </li>
              <li>
                <Link href="/concierge/viewing" className="hover:text-neutral-950 transition-colors">
                  Private Viewing
                </Link>
              </li>
              <li>
                <Link href="/concierge/provenance" className="hover:text-neutral-950 transition-colors">
                  Care & Provenance
                </Link>
              </li>
              <li>
                <Link href="/concierge/delivery" className="hover:text-neutral-950 transition-colors">
                  Global Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sanctuaries */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-[11px] tracking-[0.18em] uppercase text-neutral-900">
              SANCTUARIES
            </h3>
            <div className="space-y-2 text-neutral-600 text-xs leading-relaxed">
              <p>No. 14 Mercer St, New York</p>
              <p>Rue de Turenne, Paris III</p>
              <p>Aoyama 5-Chome, Minato-ku, Tokyo</p>
            </div>

            <div className="pt-2">
              <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                CLIENT SUPPORT
              </span>
              <a
                href="mailto:concierge@atelier-objects.com"
                className="text-neutral-600 hover:text-black underline underline-offset-2 transition-colors"
              >
                concierge@atelier-objects.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 tracking-wider">
          <p>© 2025 ATELIER INC. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-neutral-800 transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/legal/terms" className="hover:text-neutral-800 transition-colors">
              TERMS OF SALE
            </Link>
            <Link href="/legal/authenticity" className="hover:text-neutral-800 transition-colors">
              CERTIFICATE OF AUTHENTICITY
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
