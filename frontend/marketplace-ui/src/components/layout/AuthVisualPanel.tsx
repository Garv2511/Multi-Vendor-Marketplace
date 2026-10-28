import React from 'react';

export interface AuthVisualPanelProps {
  portalSubheading?: string;
  headline?: string;
  quote?: string;
  entryNumber?: string;
  entryDescription?: string;
}

export const AuthVisualPanel: React.FC<AuthVisualPanelProps> = ({
  portalSubheading = 'PRIVATE CLIENT PORTAL',
  headline = 'Crafted for the discerning individual.',
  quote = '“We strip away the extraneous so that only proportion, material truth, and quiet permanence remain.”',
  entryNumber = 'Archive Entry No. 084',
  entryDescription = 'Authenticity certificates & limited consignments',
}) => {
  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[700px] bg-[#f4f2ee] border border-neutral-300/70 p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
      {/* Background Architectural Vector Geometric Line Art */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line x1="300" y1="50" x2="100" y2="750" stroke="#b8b0a5" strokeWidth="0.8" />
        <line x1="300" y1="50" x2="500" y2="750" stroke="#b8b0a5" strokeWidth="0.8" />
        <line x1="300" y1="50" x2="300" y2="750" stroke="#b8b0a5" strokeWidth="0.6" strokeDasharray="3 3" />

        {/* Horizontal Perspective Tiers */}
        <line x1="260" y1="200" x2="340" y2="200" stroke="#b8b0a5" strokeWidth="0.7" />
        <line x1="210" y1="360" x2="390" y2="360" stroke="#b8b0a5" strokeWidth="0.7" />
        <line x1="160" y1="520" x2="440" y2="520" stroke="#b8b0a5" strokeWidth="0.7" />
        <line x1="110" y1="700" x2="490" y2="700" stroke="#b8b0a5" strokeWidth="0.7" />

        {/* Diagonal Cross Rays */}
        <line x1="100" y1="750" x2="300" y2="360" stroke="#b8b0a5" strokeWidth="0.5" />
        <line x1="500" y1="750" x2="300" y2="360" stroke="#b8b0a5" strokeWidth="0.5" />
        <circle cx="300" cy="50" r="4" fill="#a47c4c" />
      </svg>

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-semibold tracking-[0.22em] uppercase text-[#9c784e]">
        <span>SALON D&apos;INITIATION</span>
        <span>EST. 2025</span>
      </div>

      {/* Middle Editorial Content */}
      <div className="relative z-10 my-auto py-8 space-y-6">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-600">
          <span className="w-5 h-[1px] bg-neutral-500" aria-hidden="true" />
          <span>{portalSubheading}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-neutral-900 leading-[1.18] max-w-md">
          {headline}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 font-light italic leading-relaxed max-w-sm">
          {quote}
        </p>

        {/* Provenance & Care Inset Graphic Box */}
        <div className="pt-4 max-w-sm">
          <div className="bg-white/95 backdrop-blur-sm border border-neutral-300/80 p-3.5 sm:p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="w-14 h-14 shrink-0 bg-[#e7e3dc] border border-neutral-300/80 overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 60 60"
                fill="none"
                className="w-full h-full text-neutral-700"
                aria-hidden="true"
              >
                <rect width="60" height="60" fill="#ded9d0" />
                <path d="M15 45L30 15L45 45Z" fill="#b3aba0" />
                <circle cx="30" cy="35" r="9" fill="#5c5750" />
                <path d="M22 45C22 38 38 38 38 45" stroke="#2c2825" strokeWidth="2" />
              </svg>
            </div>

            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#9c784e]">
                PROVENANCE & CARE
              </span>
              <p className="text-xs font-semibold text-neutral-900 tracking-wide">
                {entryNumber}
              </p>
              <p className="text-[11px] text-neutral-500 leading-tight">
                {entryDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-600 border-t border-neutral-300/60 pt-4">
        <span>PARIS • NEW YORK • TOKYO</span>
        <span>MEMBER PROTOCOL 4.2</span>
      </div>
    </div>
  );
};

export default AuthVisualPanel;

