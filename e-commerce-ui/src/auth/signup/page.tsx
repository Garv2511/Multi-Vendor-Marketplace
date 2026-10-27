import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { AuthCard } from '../../components/ui/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from '../../components/ui/Icons';

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

export interface SignupProps {
  onNavigateToLogin?: () => void;
}

interface SignupErrors {
  storeName?: string;
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const SignupPage: React.FC<SignupProps> = ({ onNavigateToLogin }) => {
  // Form fields
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const [errors, setErrors] = useState<SignupErrors>({});

  // Cooldown countdown for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Client-side validation
  const validateForm = (): boolean => {
    const errs: SignupErrors = {};

    if (!storeName.trim()) {
      errs.storeName = 'Store name is required';
    }

    if (!email.trim()) {
      errs.email = 'Owner email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!otpSent) {
      errs.otp = 'Please send and verify an email OTP before registering';
    } else if (!otp.trim()) {
      errs.otp = 'Please enter the 6-digit OTP';
    } else if (!otpVerified) {
      errs.otp = 'Please click Verify to authenticate your email OTP';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /**
   * Request OTP from backend vendor-service
   * POST ${VENDOR_SERVICE_URL}/auth/request-otp
   */
  const handleSendOtp = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email before requesting OTP' }));
      return;
    }

    setErrors((prev) => ({ ...prev, email: undefined, otp: undefined }));
    setIsSendingOtp(true);

    try {
      const res = await fetch(`${VENDOR_SERVICE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setCountdown(60); // 60-second cooldown
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      setErrors((prev) => ({ ...prev, otp: message }));
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Verify OTP with backend vendor-service
   * POST ${VENDOR_SERVICE_URL}/auth/verify-otp
   */
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrors((prev) => ({ ...prev, otp: 'Enter the OTP sent to your email' }));
      return;
    }

    setIsVerifyingOtp(true);
    setErrors((prev) => ({ ...prev, otp: undefined }));

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
        throw new Error(data.message || data.error || 'Invalid or expired OTP code');
      }

      // Store JWT token to authenticate the vendor profile registration
      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('vendor_token', data.token);
      }

      setOtpVerified(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid or expired OTP code';
      setErrors((prev) => ({ ...prev, otp: message }));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Submit registration to backend vendor-service
   * POST ${VENDOR_SERVICE_URL}/register
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

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

      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please check details and try again.';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AuthCard
      title="Create Store Account"
      subtitle="Register your multi-vendor storefront and verify owner details."
      badge="VENDOR SIGNUP"
      footer={
        <p>
          Already have a vendor account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      }
    >
      {/* Success Banner */}
      {isSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircleIcon className="text-emerald-600 shrink-0" />
          <span>
            <strong>Registration submitted!</strong> Store successfully registered.
          </span>
        </div>
      )}

      {/* General Error Banner */}
      {errors.general && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* 1. Store Name */}
        <Input
          label="Store Name"
          placeholder="e.g. Apex Electronics"
          value={storeName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStoreName(e.target.value);
            if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: undefined }));
          }}
          error={errors.storeName}
          required
        />

        {/* 2. Owner Email + Send OTP */}
        <div className="space-y-1.5">
          <Input
            label="Owner Email"
            type="email"
            placeholder="owner@store.com"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setOtpSent(false);
              setOtpVerified(false);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            required
            rightElement={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSendOtp}
                isLoading={isSendingOtp}
                disabled={countdown > 0 || !email.trim()}
                className="text-xs h-7 px-2.5"
              >
                {countdown > 0 ? `${countdown}s` : otpSent ? 'Resend' : 'Send OTP'}
              </Button>
            }
          />
        </div>

        {/* 3. OTP Verification Field */}
        {otpSent && (
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <Input
              label="Email Verification OTP"
              type="text"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              disabled={otpVerified}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setOtp(e.target.value);
                if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
              }}
              error={errors.otp}
              required
              rightElement={
                <Button
                  type="button"
                  variant={otpVerified ? 'outline' : 'primary'}
                  size="sm"
                  onClick={handleVerifyOtp}
                  isLoading={isVerifyingOtp}
                  disabled={otpVerified || !otp.trim()}
                  className={`text-xs h-7 px-2.5 ${otpVerified
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                    : ''
                    }`}
                >
                  {otpVerified ? (
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircleIcon /> Verified
                    </span>
                  ) : (
                    'Verify'
                  )}
                </Button>
              }
            />

            {!otpVerified ? (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verification OTP was sent to <strong>{email}</strong>
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Email address verified
              </p>
            )}
          </div>
        )}

        {/* 4. Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />

        {/* 5. Confirm Password */}
        <div className="space-y-1">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            error={errors.confirmPassword}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
          {confirmPassword && password && confirmPassword === password && (
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircleIcon /> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full shadow-md shadow-indigo-600/10"
          >
            Register Store & Sign Up
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignupPage;

