import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  BarChartIcon,
  PackageIcon,
  TruckIcon,
  BanknoteIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon,
} from '../components/ui/Icons';
import type { Product, FulfillmentStatus, ProductStatus } from '../types/marketplace';
import VendorProductManagement from '../components/VendorProductManagement';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const VendorDashboardView: React.FC<{ onNavigateToProfile: () => void }> = ({
  onNavigateToProfile,
}) => {
  const {
    vendors,
    currentVendor,
    setCurrentVendorId,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateSubOrderStatus,
    payouts,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'fulfillment' | 'payouts'
  >('analytics');

  // Product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState<number>(500);
  const [formStock, setFormStock] = useState<number>(10);
  const [formCategory, setFormCategory] = useState<
    'Living & Objects' | 'Ceramics & Clay' | 'Architectural Lighting' | 'Monographs'
  >('Living & Objects');
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80'
  );
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<ProductStatus>('active');

  const vendor = currentVendor || vendors[0];
  const showLegacyProducts = false;

  // Vendor's products
  const vendorProducts = useMemo(
    () => products.filter((p) => p.vendorId === vendor.userId),
    [products, vendor.userId]
  );

  // Vendor's sub-orders across all orders
  const vendorSubOrders = useMemo(() => {
    const list: {
      orderId: string;
      createdAt: string;
      customerEmail: string;
      shippingAddress: any;
      subOrder: any;
    }[] = [];

    orders.forEach((ord) => {
      ord.subOrders
        .filter((sub) => sub.vendorId === vendor.userId)
        .forEach((sub) => {
          list.push({
            orderId: ord.id,
            createdAt: ord.createdAt,
            customerEmail: ord.customerEmail,
            shippingAddress: ord.shippingAddress,
            subOrder: sub,
          });
        });
    });
    return list;
  }, [orders, vendor.userId]);

  // Vendor's payouts
  const vendorPayouts = useMemo(
    () => payouts.filter((p) => p.vendorId === vendor.userId),
    [payouts, vendor.userId]
  );

  // Financial Metrics
  const grossSales = vendorSubOrders.reduce((sum, item) => sum + item.subOrder.amount, 0);
  const platformFee = Math.round((grossSales * vendor.commissionPct) / 100);
  const netEarnings = grossSales - platformFee;
  const totalStockUnits = vendorProducts.reduce((sum, p) => sum + p.stock, 0);

  // Analytics Chart Data
  const monthlyRevenueData = [
    { month: 'Jun', gross: Math.round(grossSales * 0.45), net: Math.round(netEarnings * 0.45) },
    { month: 'Jul', gross: Math.round(grossSales * 0.6), net: Math.round(netEarnings * 0.6) },
    { month: 'Aug', gross: Math.round(grossSales * 0.75), net: Math.round(netEarnings * 0.75) },
    { month: 'Sep', gross: Math.round(grossSales * 0.9), net: Math.round(netEarnings * 0.9) },
    { month: 'Oct (Current)', gross: grossSales || 4200, net: netEarnings || 3600 },
  ];

  const categoryDistributionData = [
    { name: 'Lighting', count: vendorProducts.filter((p) => p.category === 'Architectural Lighting').length },
    { name: 'Living', count: vendorProducts.filter((p) => p.category === 'Living & Objects').length },
    { name: 'Ceramics', count: vendorProducts.filter((p) => p.category === 'Ceramics & Clay').length },
    { name: 'Monographs', count: vendorProducts.filter((p) => p.category === 'Monographs').length },
  ];

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormPrice(650);
    setFormStock(12);
    setFormCategory('Living & Objects');
    setFormImage('https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80');
    setFormDescription('Sculptural tactile artifact designed for quiet monumental environments.');
    setFormStatus('active');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormCategory(p.category);
    setFormImage(p.images[0] || '');
    setFormDescription(p.description);
    setFormStatus(p.status);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: formTitle,
        price: Number(formPrice),
        stock: Number(formStock),
        category: formCategory,
        images: [formImage],
        description: formDescription,
        status: formStatus,
      });
    } else {
      addProduct({
        vendorId: vendor.userId,
        vendorName: vendor.storeName,
        title: formTitle,
        price: Number(formPrice),
        stock: Number(formStock),
        category: formCategory,
        images: [formImage],
        description: formDescription,
        status: formStatus,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleFulfillmentToggle = (orderId: string, currentStatus: FulfillmentStatus) => {
    const nextStatus: Record<FulfillmentStatus, FulfillmentStatus> = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: 'delivered',
    };
    updateSubOrderStatus(orderId, vendor.userId, nextStatus[currentStatus]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Top Banner & Vendor Context Switcher */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#9c784e]">
            <span className="w-2 h-2 bg-[#9c784e]" />
            <span>AUTHENTICATED ATELIER HUB • VENDOR ID #{vendor.userId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-neutral-900 tracking-tight">
            {vendor.storeName}
          </h1>
          <p className="text-xs text-neutral-500 font-light flex items-center gap-3">
            <span>Slug: /{vendor.slug}</span>
            <span>•</span>
            <span>Commission Rate: {vendor.commissionPct}%</span>
            <span>•</span>
            <span>Payout Account: {vendor.payoutAccountId}</span>
          </p>
        </div>

        {/* Right side controls: Vendor Switcher & Status */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">KYC Status</span>
            <span
              className={`text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 ${vendor.status === 'verified'
                  ? 'text-emerald-700'
                  : vendor.status === 'pending'
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
            >
              {vendor.status === 'verified' ? (
                <CheckCircleIcon className="w-3.5 h-3.5" />
              ) : (
                <AlertCircleIcon className="w-3.5 h-3.5" />
              )}
              {vendor.status}
            </span>
          </div>

          <div className="border-l border-neutral-200 pl-4 flex flex-col">
            <label className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
              Switch Active Atelier
            </label>
            <select
              value={vendor.userId}
              onChange={(e) => setCurrentVendorId(Number(e.target.value))}
              aria-label="Switch Active Atelier"
              className="bg-[#f6f6f4] border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800 font-medium focus:outline-none rounded-none cursor-pointer"
            >
              {vendors.map((v) => (
                <option key={v.userId} value={v.userId}>
                  {v.storeName} ({v.status})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onNavigateToProfile}
            className="border border-black hover:bg-neutral-900 hover:text-white px-4 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors rounded-none cursor-pointer"
          >
            KYC & DOSSIER →
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-400">
            GROSS SUB-ORDER GMV
          </span>
          <p className="text-2xl font-normal text-neutral-900 tracking-tight">
            ${grossSales.toLocaleString()}
          </p>
          <span className="text-[10px] text-neutral-500 font-light block">
            Across {vendorSubOrders.length} customer line items
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-400">
            PLATFORM COMMISSION ({vendor.commissionPct}%)
          </span>
          <p className="text-2xl font-normal text-[#9c784e] tracking-tight">
            ${platformFee.toLocaleString()}
          </p>
          <span className="text-[10px] text-neutral-500 font-light block">
            Deducted automatically at settlement
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-400">
            NET EARNINGS ESCROW
          </span>
          <p className="text-2xl font-semibold text-neutral-900 tracking-tight">
            ${netEarnings.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Available for next automated payout cycle
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-400">
            ACTIVE CATALOG SPECIMENS
          </span>
          <p className="text-2xl font-normal text-neutral-900 tracking-tight">
            {vendorProducts.length}{' '}
            <span className="text-xs text-neutral-500 font-normal">({totalStockUnits} units)</span>
          </p>
          <span className="text-[10px] text-neutral-500 font-light block">
            Live in multi-vendor marketplace
          </span>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="flex border-b border-neutral-200 gap-2 sm:gap-6 text-xs font-semibold tracking-[0.18em] uppercase overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'analytics'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-400 hover:text-black'
            }`}
        >
          <BarChartIcon />
          <span>REVENUE & ANALYTICS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'products'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-400 hover:text-black'
            }`}
        >
          <PackageIcon />
          <span>INVENTORY & CATALOG ({vendorProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fulfillment')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'fulfillment'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-400 hover:text-black'
            }`}
        >
          <TruckIcon />
          <span>SUB-ORDER FULFILLMENT ({vendorSubOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'payouts'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-400 hover:text-black'
            }`}
        >
          <BanknoteIcon />
          <span>PAYOUTS LEDGER ({vendorPayouts.length})</span>
        </button>
      </div>

      {/* Tab 1: Analytics & Charts */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-900">
                  Revenue Trajectory & Net Payouts
                </h3>
                <p className="text-xs text-neutral-500 font-light">
                  Comparative analysis of Gross GMV vs. Net Bank Transfers post-commission deduction.
                </p>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                USD ($)
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9c784e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9c784e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeec" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0de',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gross"
                    stroke="#1a1a1a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#grossGradient)"
                    name="Gross GMV"
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#9c784e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#netGradient)"
                    name="Net Payout"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-900">
              Specimens by Category
            </h3>
            <p className="text-xs text-neutral-500 font-light">
              Inventory density across curated design categories.
            </p>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#666' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0de',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" fill="#2a2825" radius={[2, 2, 0, 0]} name="Specimens" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Inventory Management */}
      {activeTab === 'products' && (
        <>
          <VendorProductManagement />
        {showLegacyProducts && (<div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold uppercase tracking-wide text-neutral-900">
                Atelier Catalog & Stock
              </h2>
              <p className="text-xs text-neutral-500 font-light">
                Manage archival artifacts, pricing, and live inventory allocations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors flex items-center gap-2 rounded-none cursor-pointer self-start sm:self-auto"
            >
              <PlusIcon />
              <span>COMMISSION NEW SPECIMEN</span>
            </button>
          </div>

          {vendorProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 bg-white space-y-3">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                No active specimens listed in your atelier catalog.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-black text-white px-5 py-2 text-xs font-semibold tracking-wider uppercase"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#fbfbfa] text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-600">
                    <th className="py-3 px-4">Specimen</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {vendorProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-12 h-12 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900">{prod.title}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">ID: {prod.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{prod.category}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">
                        ${prod.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-medium ${prod.stock <= 5 ? 'text-amber-700 font-bold' : 'text-neutral-700'
                            }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${prod.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.status === 'out_of_stock'
                                ? 'bg-neutral-200 text-neutral-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {prod.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
                          title="Edit specimen"
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                          title="Delete specimen"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>)}
        </div>)}
        </>
      )}

      {/* Tab 3: Order Fulfillment */}
      {activeTab === 'fulfillment' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wide text-neutral-900">
              Vendor-Specific Sub-Orders
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Distributed sub-orders allocated specifically to {vendor.storeName}. Advance fulfillment states to trigger tracking notifications.
            </p>
          </div>

          {vendorSubOrders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 bg-white">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                No orders currently dispatched to this atelier.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorSubOrders.map((entry, idx) => {
                const sub = entry.subOrder;
                return (
                  <div
                    key={`${entry.orderId}-${idx}`}
                    className="bg-white border border-neutral-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm text-neutral-900">
                            Order {entry.orderId}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${sub.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : sub.status === 'processing'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-neutral-100 text-neutral-800'
                              }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          Placed: {new Date(entry.createdAt).toLocaleString()} • Recipient: {entry.customerEmail}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-neutral-900">
                          ${sub.amount.toLocaleString()}
                        </span>

                        {sub.status !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => handleFulfillmentToggle(entry.orderId, sub.status)}
                            className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer rounded-none"
                          >
                            Mark as{' '}
                            {sub.status === 'pending'
                              ? 'Processing'
                              : sub.status === 'processing'
                                ? 'Shipped'
                                : 'Delivered'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub-order items list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-400 block mb-2">
                          DISPATCH SPECIMENS
                        </span>
                        <ul className="space-y-2">
                          {sub.items.map((item: any, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-xs">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-9 h-9 object-cover bg-neutral-100 border border-neutral-200"
                              />
                              <div>
                                <p className="font-semibold text-neutral-900">{item.title}</p>
                                <p className="text-[10px] text-neutral-500">
                                  Qty: {item.quantity} • ${item.price.toLocaleString()} each
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs space-y-1 text-neutral-600 bg-[#f9f9f8] p-3 border border-neutral-200">
                        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-400 block mb-1">
                          DELIVERY SANCTUARY
                        </span>
                        <p className="font-semibold text-neutral-900">{entry.shippingAddress?.name}</p>
                        <p>{entry.shippingAddress?.address}</p>
                        <p>
                          {entry.shippingAddress?.city}, {entry.shippingAddress?.country}
                        </p>
                        {sub.trackingNumber && (
                          <p className="text-[10px] text-blue-700 font-mono pt-1">
                            Tracking: {sub.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Payouts Ledger */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wide text-neutral-900">
              Automated Payouts Ledger
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Auditable settlement disbursements sent to banking destination {vendor.payoutAccountId}.
            </p>
          </div>

          {vendorPayouts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 bg-white">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                No historical settlements found for this atelier.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#fbfbfa] text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-600">
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Cycle Period</th>
                    <th className="py-3 px-4">Gross Sales</th>
                    <th className="py-3 px-4">Fee ({vendor.commissionPct}%)</th>
                    <th className="py-3 px-4">Net Transfer</th>
                    <th className="py-3 px-4">Wire Transfer ID</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {vendorPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-neutral-900">{p.id}</td>
                      <td className="py-3 px-4 text-neutral-500">
                        {p.periodStart} → {p.periodEnd}
                      </td>
                      <td className="py-3 px-4 font-mono">${p.grossAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-neutral-400 font-mono">
                        -${p.commission.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-800 font-mono">
                        ${p.netAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{p.transferId}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
                {editingProduct ? 'Edit Specimen Listing' : 'Commission New Archival Specimen'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                  Specimen Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Basalt Monolith Vessel"
                  className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                    Inventory Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none cursor-pointer"
                  >
                    <option value="Living & Objects">Living & Objects</option>
                    <option value="Ceramics & Clay">Ceramics & Clay</option>
                    <option value="Architectural Lighting">Architectural Lighting</option>
                    <option value="Monographs">Monographs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-700 mb-1">
                  Provenance & Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#f6f6f4] border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none rounded-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border border-neutral-300 px-4 py-2 uppercase tracking-wider text-[10px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white px-6 py-2 uppercase tracking-wider text-[10px] font-semibold cursor-pointer"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboardView;
