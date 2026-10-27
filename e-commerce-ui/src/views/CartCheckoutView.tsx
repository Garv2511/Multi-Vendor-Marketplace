import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  TrashIcon,
  ShieldLockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SpinnerIcon,
} from '../components/ui/Icons';
import type { SagaStep } from '../types/marketplace';

export const CartCheckoutView: React.FC<{ onNavigateToCatalog: () => void }> = ({
  onNavigateToCatalog,
}) => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    currentSagaStatus,
    currentIdempotencyKey,
  } = useMarketplace();

  const [name, setName] = useState('Lady Alistair Finch');
  const [email, setEmail] = useState('alistair@hauteliving.co.uk');
  const [address, setAddress] = useState('7 Grosvenor Crescent, Belgravia');
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('United Kingdom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Group cart items by vendor to visualize Order Splitting
  const vendorGroups = React.useMemo(() => {
    const map = new Map<number, { vendorName: string; items: typeof cart; subtotal: number }>();
    cart.forEach((item) => {
      if (!map.has(item.vendorId)) {
        map.set(item.vendorId, { vendorName: item.vendorName, items: [], subtotal: 0 });
      }
      const group = map.get(item.vendorId)!;
      group.items.push(item);
      group.subtotal += item.price * item.quantity;
    });
    return Array.from(map.entries());
  }, [cart]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const order = await placeOrder({
        name,
        email,
        address,
        city,
        country,
      });
      setCompletedOrder(order);
    } catch (err) {
      console.error('Order Saga failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const sagaStepColor = (targetStep: SagaStep, current: SagaStep | null) => {
    const order: SagaStep[] = [
      'ORDER_CREATED',
      'PAYMENT_PROCESSING',
      'PAYMENT_CAPTURED',
      'STOCK_RESERVING',
      'STOCK_RESERVED',
      'COMPLETED',
    ];
    if (!current) return 'text-neutral-300 border-neutral-200';
    const curIdx = order.indexOf(current);
    const tarIdx = order.indexOf(targetStep);

    if (curIdx >= tarIdx) return 'text-black border-black font-bold';
    return 'text-neutral-400 border-neutral-200';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-[#9c784e]">
          <span className="w-2 h-2 bg-[#9c784e]" aria-hidden="true" />
          <span>CONSOLIDATED CHECKOUT & SAGA PIPELINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900">
          Unified Multi-Vendor Cart
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl font-light">
          Customer checkout executes a distributed Saga across Payment, Catalogue, and Vendor services with automatic order splitting and idempotency safeguards.
        </p>
      </div>

      {completedOrder ? (
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircleIcon className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9c784e]">
              TRANSACTIONAL SAGA ORCHESTRATION COMPLETED
            </span>
            <h2 className="text-2xl font-normal text-neutral-900 tracking-tight">
              Order {completedOrder.id} Placed & Splitted
            </h2>
            <p className="text-xs text-neutral-500 font-mono">
              Idempotency-Key: {completedOrder.idempotencyKey}
            </p>
          </div>

          {/* Sub-Orders Breakdown */}
          <div className="border-t border-neutral-200 pt-6 text-left space-y-4">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-600 block">
              DISPATCHED SUB-ORDERS ({completedOrder.subOrders.length} ATELIERS)
            </span>

            {completedOrder.subOrders.map((sub: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#f8f8f6] border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">{sub.vendorName}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 uppercase font-bold tracking-wider">
                    {sub.status}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between">
                  <span>{sub.items.map((i: any) => `${i.quantity}x ${i.title}`).join(', ')}</span>
                  <span className="font-semibold text-neutral-900">${sub.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="bg-black text-white px-8 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:bg-neutral-800 cursor-pointer rounded-none"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-300 bg-[#fafaf8] space-y-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Your client dossier contains no acquisitions.
          </p>
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="bg-black text-white px-6 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase hover:bg-neutral-800 cursor-pointer rounded-none"
          >
            EXPLORE CATALOGUE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items grouped by Vendor */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              {vendorGroups.map(([vendorId, group]) => (
                <div key={vendorId} className="bg-white border border-neutral-200 p-6 shadow-sm space-y-4">
                  {/* Vendor Group Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#9c784e]" />
                      <span className="text-xs font-bold tracking-[0.18em] uppercase text-neutral-800">
                        {group.vendorName}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 tracking-wider">
                      SUB-ORDER TOTAL: <strong className="text-neutral-900">${group.subtotal.toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Items from this vendor */}
                  <ul className="divide-y divide-neutral-100">
                    {group.items.map((item) => (
                      <li key={item.productId} className="py-4 flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 object-cover bg-neutral-100 border border-neutral-200"
                          />
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-semibold text-neutral-900">{item.title}</h3>
                            <p className="text-[11px] text-neutral-500">${item.price.toLocaleString()} each</p>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-neutral-300">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-mono font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Distributed Architecture Explainer Inset */}
            <div className="p-5 bg-[#f4f2ee] border border-neutral-300 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldLockIcon className="text-[#9c784e]" />
                <span className="font-bold tracking-[0.16em] uppercase text-neutral-900 text-[10px]">
                  DISTRIBUTED SAGA ARCHITECTURE (PROJECT 18 REQUIREMENT)
                </span>
              </div>
              <p className="text-neutral-600 leading-relaxed font-light text-[11px]">
                Upon pressing checkout, the client generates a unique <strong>Idempotency-Key</strong>. The order orchestrator creates the parent order, delegates payment capture to Payments microservice, instructs Catalogue to reserve inventory stock, and splits fulfillment into separate sub-orders for each atelier.
              </p>
            </div>
          </div>

          {/* Right Column: Checkout & Saga Orchestration Status */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500">
                  CONSOLIDATED SUMMARY
                </span>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-2xl font-normal text-neutral-900 tracking-tight">Total</span>
                  <span className="text-2xl font-semibold text-neutral-900">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Live Saga Pipeline Tracker */}
              {isProcessing && (
                <div className="p-4 bg-[#faf9f6] border border-neutral-300 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[#9c784e]">
                    <span>SAGA ORCHESTRATION PIPELINE</span>
                    <span className="animate-pulse">PROCESSING</span>
                  </div>

                  {currentIdempotencyKey && (
                    <p className="text-[10px] font-mono text-neutral-500 truncate">
                      Header: Idempotency-Key: {currentIdempotencyKey}
                    </p>
                  )}

                  <div className="space-y-1.5 text-[11px]">
                    <div className={`flex items-center gap-2 ${sagaStepColor('ORDER_CREATED', currentSagaStatus)}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>1. Order Emitted (order.created)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${sagaStepColor('PAYMENT_CAPTURED', currentSagaStatus)}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>2. Payments Service Capture (payment.succeeded)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${sagaStepColor('STOCK_RESERVED', currentSagaStatus)}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>3. Catalogue Stock Reservation (stock.reserved)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Details Form */}
              <form onSubmit={handleCheckout} className="space-y-4" noValidate>
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                    CLIENT FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f4f4f2] border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                    CLIENT EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f4f4f2] border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                    SHIPPING SANCTUARY ADDRESS
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#f4f4f2] border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black rounded-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                      CITY
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#f4f4f2] border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-700 mb-1">
                      COUNTRY
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#f4f4f2] border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black rounded-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-4 px-6 text-xs font-semibold tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-none disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <SpinnerIcon />
                        <span>COORDINATING SAGA...</span>
                      </>
                    ) : (
                      <>
                        <span>AUTHORIZE & DISPATCH SPLIT ORDER</span>
                        <ArrowRightIcon />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckoutView;

