import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { AuthVisualPanel } from '../../components/layout/AuthVisualPanel';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  EyeIcon,
  EyeOffIcon,
  ShieldLockIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CheckIcon,
  SpinnerIcon,
} from '../../components/ui/Icons';

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

export interface SignupProps {
  onNavigateToLogin?: () => void;
  onNavigateToProfile?: () => void;
}

export const SignupPage: React.FC<SignupProps> = ({
  onNavigateToLogin,
  onNavigateToProfile,
}) => {
  const { loginUser } = useMarketplace();
  // Form fields
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // OTP cooldown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid client identification email before requesting OTP.');
      return;
    }

    setErrorMessage(null);
    setIsSendingOtp(true);

    try {
      const res = await fetch(`${VENDOR_SERVICE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to dispatch verification OTP');
      }

      setOtpSent(true);
      setCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending verification code';
      setErrorMessage(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMessage('Please input the 6-digit keycode delivered to your email.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${VENDOR_SERVICE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Invalid or expired verification keycode');
      }

      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('vendor_token', data.token);
      }

      setOtpVerified(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid keycode';
      setErrorMessage(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      setErrorMessage('Store title is required for dossier creation.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Client email identification is required.');
      return;
    }
    if (!otpVerified) {
      setErrorMessage('Please complete email verification with your OTP keycode first.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Keycode must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Keycode confirmation does not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Atelier Protocol & Terms.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const token = authToken || localStorage.getItem('vendor_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        storeName: storeName.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      const res = await fetch(`${VENDOR_SERVICE_URL}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      loginUser(payload.email);

      setIsSuccess(true);
      if (onNavigateToProfile) {
        setTimeout(() => onNavigateToProfile(), 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting registration';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 sm:my-14 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Left Editorial Panel */}
        <div className="hidden lg:block">
          <AuthVisualPanel
            portalSubheading="MEMBERSHIP PROTOCOL"
            headline="Request Client Membership."
            quote="“Initiate a private client dossier for bespoke acquisitions, store provenance, and commissions.”"
            entryNumber="Initiation Protocol 085"
            entryDescription="Archival store registration & credentialing"
          />
        </div>

        {/* Right Form Card */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          {/* Header Badge & Title */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-900">
              <span className="w-2 h-2 bg-neutral-900" aria-hidden="true" />
              <span>REGISTRATION</span>
            </div>

          </div>

          {/* Alerts */}
          {isSuccess && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs tracking-wide flex items-center gap-2">
              <CheckCircleIcon className="text-emerald-600" />
              <span>Success! Redirecting to store profile...</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Store Name Field */}
            <div>
              <label
                htmlFor="signup-store"
                className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
              >
                STORE NAME<span className="text-neutral-900">*</span>
              </label>
              <input
                id="signup-store"
                type="text"
                value={storeName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreName(e.target.value)}
                placeholder="e.g. Apex Artisans Atelier"
                required
                className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 focus:outline-none"
              />
            </div>

            {/* Email Field with Send OTP Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signup-email"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700"
                >
                  EMAIL <span className="text-neutral-900">*</span>
                </label>
                {otpVerified && (
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald-700 flex items-center gap-1">
                    <CheckIcon /> VERIFIED
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setOtpSent(false);
                    setOtpVerified(false);
                  }}
                  placeholder="owner@atelier-objects.com"
                  required
                  className="flex-1 bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || countdown > 0 || !email.trim()}
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap"
                >
                  {isSendingOtp
                    ? 'SENDING...'
                    : countdown > 0
                      ? `WAIT ${countdown}S`
                      : otpSent
                        ? 'RESEND KEYCODE'
                        : 'SEND KEYCODE'}
                </button>
              </div>
            </div>

            {/* OTP Keycode Field */}
            {otpSent && (
              <div className="p-3.5 bg-[#f7f6f2] border border-neutral-200 space-y-2">
                <label
                  htmlFor="signup-otp"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700"
                >
                  EMAIL VERIFICATION KEYCODE <span className="text-neutral-900">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="signup-otp"
                    type="text"
                    maxLength={6}
                    disabled={otpVerified}
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="flex-1 bg-white border border-neutral-300 text-neutral-900 text-xs px-3 py-2.5 rounded-none focus:outline-none tracking-widest font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otpVerified || !otp.trim()}
                    className={`px-4 py-2.5 text-[10px] font-semibold tracking-[0.16em] uppercase rounded-none transition-colors cursor-pointer ${otpVerified
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-black text-white hover:bg-neutral-800 disabled:opacity-50'
                      }`}
                  >
                    {isVerifyingOtp ? 'CHECKING...' : otpVerified ? 'VERIFIED' : 'VERIFY KEYCODE'}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">
                  A verification code was dispatched to <strong>{email}</strong>
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
              >
                PASSWORD <span className="text-neutral-900">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="•••••••••••• (min. 6 characters)"
                  required
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide keycode' : 'Show keycode'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700"
                >
                  CONFIRM PASSWORD <span className="text-neutral-900">*</span>
                </label>
                {confirmPassword && password && confirmPassword === password && (
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald-700 flex items-center gap-1">
                    <CheckIcon /> MATCHED
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm keycode' : 'Show confirm keycode'}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-none border-neutral-300 accent-neutral-900 text-black cursor-pointer"
                />
                <span className="text-[11px] text-neutral-600">
                  Agree to the Atelier Protocol & Terms
                </span>
              </label>

              <span className="inline-flex items-center gap-1.5 text-[#9c784e] font-semibold text-[10px] tracking-[0.16em]">
                <ShieldLockIcon />
                <span>256-BIT VAULT</span>
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 px-6 font-semibold tracking-[0.18em] uppercase text-xs transition-colors rounded-none flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon />
                    <span>INITIATING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT</span>
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch Card */}
          <div className="mt-8 p-4 bg-[#f4f2ee] border border-neutral-200/80 text-center space-y-1.5">
            <p className="text-[11px] text-neutral-600">
              Already a member?
            </p>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-900 hover:text-black transition-colors cursor-pointer"
            >
              <span>ACCESS YOUR ACCOUNT</span>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
