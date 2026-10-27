import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldLock } from 'react-bootstrap-icons';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfb] text-neutral-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* Hero Section */}
        <div className="relative border border-neutral-300/80 bg-[#f6f5f2] p-8 sm:p-16 lg:p-20 overflow-hidden">
          {/* Subtle Geometric Background */}
          <svg
            className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none"
            viewBox="0 0 500 500"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="250" cy="250" r="200" stroke="#b8b0a5" strokeWidth="0.8" />
            <polygon points="250,50 423,350 77,350" stroke="#b8b0a5" strokeWidth="0.8" />
            <line x1="250" y1="50" x2="250" y2="450" stroke="#b8b0a5" strokeWidth="0.6" strokeDasharray="3 3" />
          </svg>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#9c784e]">
              <span className="w-5 h-[1px] bg-[#9c784e]" aria-hidden="true" />
              <span>COLLECTION 2025 • VOL. IV</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.12]">
              Architectural purity and tactile form.
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-xl">
              An intentional archive of limited edition design objects, lighting, and ceramics
              crafted in collaboration with independent ateliers worldwide.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span>ACCESS VAULT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white border border-neutral-300 px-7 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span>REQUEST MEMBERSHIP</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Archive Preview */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9c784e]">
                RECENT ADDITIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                Curated Dossier Entries
              </h2>
            </div>
            <Link
              href="/auth/login"
              className="text-xs font-semibold tracking-[0.16em] uppercase text-neutral-700 hover:text-black flex items-center gap-1.5"
            >
              <span>VIEW FULL ARCHIVE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: '084',
                title: 'Alabaster Vessel No. 084',
                origin: 'Paris Atelier',
                material: 'Hand-carved Alabaster & Bronze',
              },
              {
                id: '091',
                title: 'Monolithic Sconce IV',
                origin: 'Tokyo Studio',
                material: 'Cast Smoked Glass & Patinated Brass',
              },
              {
                id: '107',
                title: 'Travertine Low Plinth',
                origin: 'Milan Archive',
                material: 'Unfilled Roman Travertine',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="group border border-neutral-200/90 bg-white p-6 hover:border-black transition-colors"
              >
                <div className="aspect-[4/3] bg-[#f2eee9] border border-neutral-200/60 mb-5 flex items-center justify-center p-6 group-hover:bg-[#ebe6df] transition-colors">
                  <div className="w-20 h-20 border border-neutral-400/50 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-xs tracking-widest text-neutral-500 -rotate-45 group-hover:rotate-0 transition-transform">
                      NO. {item.id}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9c784e]">
                    {item.origin}
                  </span>
                  <h3 className="text-sm font-medium text-neutral-900 tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{item.material}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vault Protocol Banner */}
        <section className="bg-[#f4f2ee] border border-neutral-300/80 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#9c784e]">
              <ShieldLock className="w-4 h-4" />
              <span>PRIVATE DOSSIER ENCRYPTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
              Protected by 256-Bit Cryptographic Vault Protocol
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Consignments, bespoke acquisitions, and certificate authenticity are registered in
              an encrypted client dossier. Authenticate to manage your private acquisitions.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 bg-black text-white px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-neutral-800 transition-colors"
          >
            AUTHORIZE &amp; ENTER VAULT
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
