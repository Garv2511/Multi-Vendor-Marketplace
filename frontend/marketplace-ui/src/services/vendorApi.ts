import { getMyProducts, type VendorProduct } from './productApi.ts';

export interface VendorProfile {
  userId: number;
  email: string;
  storeName: string;
  slug: string;
  status: string;
  commissionPct: number;
  payoutAccountId?: string;
  kycDocs?: string[];
  uuid?: string;
}

export interface VendorOrderItem {
  productId: string;
  title: string;
  storeName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image?: string;
}

export interface VendorSubOrder {
  orderId: string;
  customerUserId: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  deliveryAddress?: {
    recipientName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: VendorOrderItem[];
}

const resolveBaseUrl = (): string => {
  let url: string | undefined;
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv) {
      url = metaEnv.VITE_VENDOR_SERVICE_URL || metaEnv.VENDOR_SERVICE_URL;
    }
  } catch {
    // Environments without import.meta.env
  }
  if (!url) {
    const globalProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
    if (globalProcess?.env) {
      url = globalProcess.env.VITE_VENDOR_SERVICE_URL || globalProcess.env.VENDOR_SERVICE_URL;
    }
  }
  return (url || 'http://localhost:3001').replace(/\/+$/, '');
};

const resolveOrderServiceUrl = (): string => {
  let url: string | undefined;
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv) {
      url = metaEnv.VITE_ORDER_SERVICE_URL || metaEnv.ORDER_SERVICE_URL;
    }
  } catch {
    // Environments without import.meta.env
  }
  if (!url) {
    const globalProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
    if (globalProcess?.env) {
      url = globalProcess.env.VITE_ORDER_SERVICE_URL || globalProcess.env.ORDER_SERVICE_URL;
    }
  }
  return (url || 'http://localhost:3003').replace(/\/+$/, '');
};

export const VENDOR_SERVICE_URL = resolveBaseUrl();
export const ORDER_SERVICE_URL = resolveOrderServiceUrl();

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('vendor_token');
  if (!token) {
    throw new Error('Please sign in with a vendor account.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const sendRequest = async <T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${baseUrl}${cleanPath}`, {
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
    throw new Error(payload.message || 'Vendor request failed.');
  }

  return payload.data as T;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  return sendRequest<T>(VENDOR_SERVICE_URL, path, options);
};

const orderRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  try {
    return await sendRequest<T>(ORDER_SERVICE_URL, path, options);
  } catch (err) {
    // Graceful fallback to vendor service if order-service is temporarily unreachable
    if (err instanceof Error && /Failed to fetch|NetworkError|ECONNREFUSED/i.test(err.message)) {
      return await sendRequest<T>(VENDOR_SERVICE_URL, path, options);
    }
    throw err;
  }
};

export const getVendorProfile = async (): Promise<VendorProfile> => {
  return request<VendorProfile>('/vendor-data/profile');
};

export const getVendorOrders = async (): Promise<VendorSubOrder[]> => {
  return orderRequest<VendorSubOrder[]>('/vendor-data/orders');
};

export const updateVendorOrderStatus = async (
  orderId: string,
  status: string
): Promise<void> => {
  await orderRequest<unknown>(`/vendor-data/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export { getMyProducts as getVendorProducts, type VendorProduct };

