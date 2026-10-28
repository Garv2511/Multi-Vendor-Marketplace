export interface VendorProduct {
  productId: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  vendorId: number;
  vendorEmail: string;
  storeName: string;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
}

const VENDOR_SERVICE_URL =
  import.meta.env.VITE_VENDOR_SERVICE_URL ||
  import.meta.env.VENDOR_SERVICE_URL ||
  'http://localhost:3001';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('vendor_token');
  if (!token) {
    throw new Error('Please sign in before managing products.');
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
    throw new Error(payload.message || 'The product request could not be completed.');
  }

  return payload.data as T;
};

export const getMyProducts = async (): Promise<VendorProduct[]> => {
  return request<VendorProduct[]>('/products/my');
};

export const createProduct = async (input: ProductInput): Promise<VendorProduct> => {
  return request<VendorProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const updateProduct = async (
  productId: string,
  input: Partial<ProductInput>
): Promise<VendorProduct> => {
  return request<VendorProduct>(`/products/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
};

export const deleteProduct = async (productId: string): Promise<{ productId: string }> => {
  return request<{ productId: string }>(`/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });
};
