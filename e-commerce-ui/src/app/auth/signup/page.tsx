import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthVisualPanel } from '@/components/features/auth/AuthVisualPanel';
import { SignupForm } from '@/components/features/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Request Client Membership | Atelier',
  description: 'Initiate a private client dossier for bespoke acquisitions, previews, and commissions.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfb] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Global Atelier Navbar */}
      <Navbar />

      {/* Main Registration Section */}
      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Atmospheric Editorial Visual Panel */}
          <div className="w-full">
            <AuthVisualPanel
              portalSubheading="MEMBERSHIP DOSSIER"
              headline="An archive reserved for architectural excellence."
              quote="“Form, materiality, and restraint. Enter an exclusive register of curated design objects and private consignments.”"
              entryNumber="Archive Registry No. 102"
              entryDescription="Priority allocations & architectural commissions"
            />
          </div>

          {/* Right Column: Atelier Membership Registration Form */}
          <div className="w-full flex items-center">
            <SignupForm />
          </div>

        </div>
      </main>

      {/* Atelier Footer */}
      <Footer />
    </div>
  );
}
