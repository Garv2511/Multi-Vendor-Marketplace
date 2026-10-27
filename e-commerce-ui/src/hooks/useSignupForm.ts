'use client';

import { useState, useCallback, useMemo, FormEvent, ChangeEvent } from 'react';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  evaluatePasswordStrength,
} from '@/utils/validation';

export interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  showPassword: boolean;
  isLoading: boolean;
  errors: {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  };
  isSuccess: boolean;
}

export function useSignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    showPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(formData.password),
    [formData.password]
  );

  const handleInputChange = useCallback(
    (field: 'fullName' | 'email' | 'password' | 'confirmPassword', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    },
    []
  );

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreeTerms: e.target.checked }));
    setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const nameCheck = validateFullName(formData.fullName);
      const emailCheck = validateEmail(formData.email);
      const passwordCheck = validatePassword(formData.password);

      const newErrors: typeof errors = {};

      if (!nameCheck.isValid) newErrors.fullName = nameCheck.error;
      if (!emailCheck.isValid) newErrors.email = emailCheck.error;
      if (!passwordCheck.isValid) newErrors.password = passwordCheck.error;

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Keycode passwords do not match.';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Consent to the Atelier Client Protocol is required.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        await new Promise((resolve) => setTimeout(resolve, 950));
        setIsSuccess(true);
      } catch {
        setErrors({
          general: 'Dossier registration failed. Please review your submission and try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  return {
    formData,
    isLoading,
    errors,
    isSuccess,
    passwordStrength,
    handleInputChange,
    handleCheckboxChange,
    toggleShowPassword,
    handleSubmit,
  };
}
