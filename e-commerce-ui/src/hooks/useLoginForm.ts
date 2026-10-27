'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { validateEmail, validatePassword } from '@/utils/validation';

export interface LoginFormState {
  email: string;
  password: string;
  preserveSession: boolean;
  showPassword: boolean;
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  isSuccess: boolean;
}

export function useLoginForm() {
  const [formData, setFormData] = useState({
    email: 'archivist@atelier-objects.com',
    password: '',
    preserveSession: true,
    showPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = useCallback((field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  }, []);

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, preserveSession: e.target.checked }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const emailCheck = validateEmail(formData.email);
      const passwordCheck = validatePassword(formData.password);

      if (!emailCheck.isValid || !passwordCheck.isValid) {
        setErrors({
          email: emailCheck.error,
          password: passwordCheck.error,
        });
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        // Simulated authentication request adhering to client guidelines
        await new Promise((resolve) => setTimeout(resolve, 900));
        setIsSuccess(true);
      } catch {
        setErrors({
          general: 'Authentication failed. Please verify your dossier credentials and retry.',
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
    handleInputChange,
    handleCheckboxChange,
    toggleShowPassword,
    handleSubmit,
  };
}
