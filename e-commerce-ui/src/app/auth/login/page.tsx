import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthVisualPanel } from '@/components/features/auth/AuthVisualPanel';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Access Your Vault | Atelier',
  description: 'Enter your credentials to review private acquisitions, reserves, and bespoke consignments.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfb] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Global Atelier Navbar */}
      <Navbar />

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Atmospheric Editorial Visual Panel */}
          <div className="w-full">
            <AuthVisualPanel
              portalSubheading="PRIVATE CLIENT PORTAL"
              headline="Crafted for the discerning individual."
              quote="“We strip away the extraneous so that only proportion, material truth, and quiet permanence remain.”"
              entryNumber="Archive Entry No. 084"
              entryDescription="Authenticity certificates & limited consignments"
            />
          </div>

          {/* Right Column: Atelier Vault Login Form */}
          <div className="w-full flex items-center">
            <LoginForm />
          </div>

        </div>
      </main>

      {/* Atelier Footer */}
      <Footer />
    </div>
  );
}
