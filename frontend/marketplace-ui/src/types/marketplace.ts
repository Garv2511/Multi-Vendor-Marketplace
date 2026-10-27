export type VendorStatus = 'pending' | 'verified' | 'suspended' | 'approved' | 'rejected';

export interface Vendor {
  userId: number;
  storeName: string;
  slug: string;
  email: string;
  kycDocs: string[];
  status: VendorStatus;
  commissionPct: number;
  payoutAccountId: string;
  uuid?: string;
  gmv?: number;
}

export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export interface Product {
  id: string;
  vendorId: number;
  vendorName: string;
  title: string;
  price: number;
  stock: number;
  category: 'Living & Objects' | 'Ceramics & Clay' | 'Architectural Lighting' | 'Monographs';
  images: string[];
  description: string;
  status: ProductStatus;
}

export interface CartItem {
  productId: string;
  vendorId: number;
  vendorName: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface SubOrder {
  vendorId: number;
  vendorName: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  amount: number;
  status: FulfillmentStatus;
  trackingNumber?: string;
}

export type SagaStep =
  | 'ORDER_CREATED'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_CAPTURED'
  | 'STOCK_RESERVING'
  | 'STOCK_RESERVED'
  | 'COMPLETED'
  | 'FAILED'
  | 'COMPENSATING';

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  subOrders: SubOrder[];
  totalAmount: number;
  paymentId: string;
  idempotencyKey: string;
  sagaStatus: SagaStep;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface Payout {
  id: string;
  vendorId: number;
  vendorName: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commission: number;
  refunds: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'settled';
  transferId: string;
  createdAt: string;
}

