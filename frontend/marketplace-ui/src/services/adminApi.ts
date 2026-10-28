import type { Vendor } from '../types/marketplace';

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('vendor_token');
  if (!token) {
    throw new Error('Please sign in with an administrator account.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${VENDOR_SERVICE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    data?: T;
  };

  if (!response.ok) {
    throw new Error(payload.message || 'The administrator request could not be completed.');
  }

  return payload.data as T;
};

export const getPendingVendors = async (): Promise<Vendor[]> => {
  return request<Vendor[]>('/admin/pending');
};

export const approveVendor = async (userId: number): Promise<void> => {
  await request<unknown>('/admin/approve', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

export const rejectVendor = async (userId: number): Promise<void> => {
  await request<unknown>('/admin/reject', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};
