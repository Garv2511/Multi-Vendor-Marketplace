import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { AuthVisualPanel } from '../../components/layout/AuthVisualPanel';
import {
  AppleIcon,
  GoogleIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldLockIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  SpinnerIcon,
} from '../../components/ui/Icons';

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

export interface LoginProps {
  onNavigateToSignup?: () => void;
  onNavigateToProfile?: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({
  onNavigateToSignup,
  onNavigateToProfile,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both identification email and vault keycode.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      const res = await fetch(`${VENDOR_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('vendor_token', data.token);
      }

      setIsSuccess(true);
      if (onNavigateToProfile) {
        setTimeout(() => onNavigateToProfile(), 800);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 sm:my-14 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Left Editorial Panel */}
        <div className="hidden lg:block">
          <AuthVisualPanel
            portalSubheading="PRIVATE CLIENT PORTAL"
            headline="Crafted for the discerning individual."
            quote="“We strip away the extraneous so that only proportion, material truth, and quiet permanence remain.”"
            entryNumber="Archive Entry No. 084"
            entryDescription="Authenticity certificates & limited consignments"
          />
        </div>

        {/* Right Form Card */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          {/* Header Badge & Title */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-900">
              <span className="w-2 h-2 bg-neutral-900" aria-hidden="true" />
              <span>AUTHENTICATION</span>
            </div>
          </div>





          {/* Alerts */}
          {isSuccess && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs tracking-wide flex items-center gap-2">
              <CheckCircleIcon className="text-emerald-600" />
              <span>Access granted. Redirecting to vault dossier...</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1.5"
              >
                CLIENT IDENTIFICATION / EMAIL <span className="text-neutral-900">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="archivist@atelier-objects.com"
                required
                className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 rounded-none transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700"
                >
                  KEYCODE / PASSWORD <span className="text-neutral-900">*</span>
                </label>
                <button
                  type="button"
                  className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9c784e] hover:underline cursor-pointer"
                >
                  FORGOT KEYCODE?
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#f4f4f2] border border-neutral-200 hover:border-neutral-300 text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900"
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



            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-neutral-800 active:bg-neutral-900 text-white py-3.5 px-6 font-semibold tracking-[0.18em] uppercase text-xs transition-colors rounded-none flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon />
                    <span>AUTHORIZING...</span>
                  </>
                ) : (
                  <>
                    <span>AUTHORIZE & ENTER</span>
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch Card */}
          <div className="mt-8 p-4 bg-[#f4f2ee] border border-neutral-200/80 text-center space-y-1.5">
            <p className="text-[11px] text-neutral-800">
              DONT HAVE AN ACCOUNT?
            </p>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-900 hover:text-black transition-colors cursor-pointer"
            >
              <span>BECOME A PARTNER</span>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
