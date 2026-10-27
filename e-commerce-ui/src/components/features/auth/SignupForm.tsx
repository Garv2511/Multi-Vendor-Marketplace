'use client';

import React from 'react';
import Link from 'next/link';
import {
  Apple,
  Google,
  Envelope,
  Eye,
  EyeSlash,
  ShieldLock,
  ArrowRight,
  ChevronRight,
  Person,
  CheckCircle,
  Check,
} from 'react-bootstrap-icons';
import { useSignupForm } from '@/hooks/useSignupForm';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';

export const SignupForm: React.FC = () => {
  const {
    formData,
    isLoading,
    errors,
    isSuccess,
    passwordStrength,
    handleInputChange,
    handleCheckboxChange,
    toggleShowPassword,
    handleSubmit,
  } = useSignupForm();

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-6 sm:px-8 bg-white border border-neutral-200 text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-normal text-neutral-900 tracking-tight">
            Client Dossier Initiated
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Your membership petition for {formData.fullName} ({formData.email}) has been submitted
            to the Atelier archive for provenance verification.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/auth/login">
            <Button variant="primary" className="w-full">
              PROCEED TO VAULT
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-6 sm:py-8 px-4 sm:px-8 bg-white">
      {/* Header Badge & Title */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900">
          <span className="w-2 h-2 bg-neutral-900" aria-hidden="true" />
          <span>REGISTRATION</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-900">
          Request Client Membership
        </h2>

        <p className="text-xs text-neutral-500 leading-relaxed">
          Initiate a private client dossier for bespoke acquisitions, previews, and commissions.
        </p>
      </div>

      {/* Social Single Sign-on Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#f7f7f6] hover:bg-[#ebebea] border border-neutral-200 text-neutral-900 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
          aria-label="Sign up with Apple"
        >
          <Apple className="w-4 h-4" />
          <span>APPLE</span>
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#f7f7f6] hover:bg-[#ebebea] border border-neutral-200 text-neutral-900 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
          aria-label="Sign up with Google"
        >
          <Google className="w-3.5 h-3.5" />
          <span>GOOGLE</span>
        </button>
      </div>

      {/* Subtle Divider */}
      <div className="relative flex items-center justify-center mb-7">
        <div className="w-full border-t border-neutral-200" />
        <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-400">
          OR REGISTER WITH DOSSIER
        </span>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div
          role="alert"
          className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide"
        >
          {errors.general}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          id="signup-name"
          label="FULL NAME / DOSSIER TITLE"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="e.g. Eleanor Vance"
          error={errors.fullName}
          required
          autoComplete="name"
          rightElement={<Person className="w-4 h-4 text-neutral-500" />}
        />

        {/* Email Field */}
        <Input
          id="signup-email"
          label="CLIENT IDENTIFICATION / EMAIL"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="archivist@atelier-objects.com"
          error={errors.email}
          required
          autoComplete="email"
          rightElement={<Envelope className="w-4 h-4 text-neutral-500" />}
        />

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="signup-password"
              className="block text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-600 select-none"
            >
              KEYCODE / CREATE PASSWORD <span className="text-neutral-900">*</span>
            </label>
          </div>

          <div className="relative flex items-center">
            <input
              id="signup-password"
              type={formData.showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
              className={`w-full bg-[#f3f3f1] border ${
                errors.password ? 'border-red-600' : 'border-neutral-200 hover:border-neutral-300'
              } text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900`}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 text-neutral-500 hover:text-neutral-900 focus:outline-none"
              aria-label={formData.showPassword ? 'Hide password' : 'Show password'}
            >
              {formData.showPassword ? (
                <EyeSlash className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p id="signup-password-error" role="alert" className="mt-1.5 text-[11px] text-red-600 font-medium">
              {errors.password}
            </p>
          )}

          {/* Password Strength Checklist */}
          {formData.password.length > 0 && (
            <div className="mt-2.5 p-2.5 bg-neutral-50 border border-neutral-200/70 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-neutral-600 text-[10px] uppercase tracking-wider mb-1">
                <span>Security Standard</span>
                <span>{passwordStrength.score} of 4 criteria met</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-neutral-600">
                <span className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                  <Check className="w-3.5 h-3.5" /> 8+ Characters
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.hasUpper ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                  <Check className="w-3.5 h-3.5" /> Capital letter
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                  <Check className="w-3.5 h-3.5" /> Number
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                  <Check className="w-3.5 h-3.5" /> Special symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="signup-confirm-password"
              className="block text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-600 select-none"
            >
              CONFIRM KEYCODE <span className="text-neutral-900">*</span>
            </label>
          </div>

          <div className="relative flex items-center">
            <input
              id="signup-confirm-password"
              type={formData.showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
              className={`w-full bg-[#f3f3f1] border ${
                errors.confirmPassword ? 'border-red-600' : 'border-neutral-200 hover:border-neutral-300'
              } text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900`}
            />
          </div>

          {errors.confirmPassword && (
            <p id="signup-confirm-password-error" role="alert" className="mt-1.5 text-[11px] text-red-600 font-medium">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2">
          <Checkbox
            id="agree-terms"
            label="Agree to the Atelier Client Protocol & Terms of Vault Access"
            checked={formData.agreeTerms}
            onChange={handleCheckboxChange}
            rightLabel={
              <span className="inline-flex items-center gap-1.5 text-[#9c784e] font-semibold text-[10px] tracking-[0.16em]">
                <ShieldLock className="w-3.5 h-3.5" />
                <span>256-BIT VAULT</span>
              </span>
            }
          />
          {errors.agreeTerms && (
            <p role="alert" className="mt-1 text-[11px] text-red-600 font-medium">
              {errors.agreeTerms}
            </p>
          )}
        </div>

        {/* Primary Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            className="w-full"
          >
            INITIATE MEMBERSHIP DOSSIER
          </Button>
        </div>
      </form>

      {/* Bottom Switch Link Card */}
      <div className="mt-8 p-4 bg-[#f4f2ee] border border-neutral-200/80 text-center space-y-1.5">
        <p className="text-[11px] text-neutral-600">
          Already hold an authorized Atelier dossier?
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-900 hover:text-black transition-colors"
        >
          <span>ACCESS YOUR VAULT</span>
          <ChevronRight className="w-3 h-3 stroke-[1.5]" />
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
