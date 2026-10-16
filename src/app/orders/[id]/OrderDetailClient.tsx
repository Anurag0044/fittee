"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Printer,
  FileText,
  Phone,
  MessageSquare,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatINR, formatIST } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { OrderStatus } from '@/lib/types';

interface OrderDetailClientProps {
  id: string;
}

export default function OrderDetailClient({ id }: OrderDetailClientProps) {
  const router = useRouter();
  const { orders, dispatchWithEkart, updateOrderStatus, cancelOrder, addOrderNote } = useStore();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AdminLayout>
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <h2 className="text-xl font-bold text-[#161714] dark:text-[#F2F1EC]">Order Not Found</h2>
          <p className="text-[13px] text-[#8C8B83]">The requested order ID &quot;{id}&quot; does not exist in the fulfillment database.</p>
          <div className="pt-2">
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B87A22] text-white text-[13px] font-semibold hover:bg-[#A36919] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const canDispatch = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'LOGISTICS_MGR';

  // Address copy handler
  const handleCopyAddress = () => {
    const addr = `${order.shippingAddress.fullName}\n${order.shippingAddress.addressLine1}${
      order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''
    }\n${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\nPhone: ${
      order.shippingAddress.phone
    }`;
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    success('Address Copied', 'Full shipping address copied to clipboard');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Dispatch handler (Ekart Logistics)
  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      const result = dispatchWithEkart(order.id);
      setIsDispatching(false);
      if (result.success) {
        success('Ekart Shipment Booked', `AWB: ${result.awb} assigned successfully`);
      }
    }, 750);
  };

  // Add internal note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addOrderNote(order.id, newNote.trim());
    setNewNote('');
    success('Note Added', 'Internal note logged to order record');
  };

  const cleanPhoneDigits = order.customerPhone.replace(/[^\d]/g, '');

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        {/* 1. Header Bar with Back navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="p-2 rounded-lg hover:bg-[#F0EFEA] dark:hover:bg-[#20221E] text-[#6B6A63] hover:text-[#161714] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-[#161714] dark:text-[#F2F1EC] font-mono tracking-tight">
                  {order.orderNumber}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
                Placed on {formatIST(order.createdAt)} • Customer ID:{' '}
                <span className="font-mono font-semibold text-[#161714] dark:text-[#F2F1EC]">
                  {order.customerCode}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {order.awbNumber && (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowLabelModal(true)}
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print Label
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowInvoiceModal(true)}
                  icon={<FileText className="w-4 h-4" />}
                >
                  GST Invoice
                </Button>
              </>
            )}

            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && canDispatch && (
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* 2. Main Grid: Left Details & Right Dispatch Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Columns): Line items, Customer & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line Items Table */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC] uppercase tracking-wider">
                Ordered Items ({order.items.length})
              </h3>

              <div className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.thumbnail}
                        alt={item.productTitle}
                        className="w-14 h-16 object-cover rounded-lg border border-[#E7E5DF] shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-[13.5px] text-[#161714] dark:text-[#F2F1EC]">
                          {item.productTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.colorName}</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold">Size: {item.size}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{item.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                        {formatINR(item.totalPrice)}
                      </p>
                      <p className="text-[11.5px] text-[#8C8B83] tabular-nums">
                        Qty: {item.quantity} × {formatINR(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Summary */}
              <div className="pt-4 border-t border-[#E7E5DF] dark:border-[#2A2C27] space-y-1.5 text-[13px]">
                <div className="flex justify-between text-[#6B6A63]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatINR(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#2F7D4F] font-semibold">
                    <span>Festive Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="font-mono tabular-nums">-{formatINR(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6A63]">
                  <span>Express Shipping</span>
                  <span className="font-mono tabular-nums">
                    {order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC] pt-2 border-t border-[#E7E5DF]">
                  <span>Total Bill Amount</span>
                  <span className="font-mono tabular-nums">{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Profile Card */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8C8B83]">
                    Customer Profile
                  </h4>
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#F0EFEA] text-[#161714]">
                    {order.customerCode}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-[14px] text-[#161714] dark:text-[#F2F1EC]">
                    {order.customerName}
                  </p>
                  <p className="text-[12.5px] text-[#6B6A63] mt-0.5">{order.customerEmail}</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5DF] hover:border-[#B87A22] text-[12px] font-medium text-[#161714] dark:text-[#F2F1EC] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B87A22]" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhoneDigits}?text=Hello%20${encodeURIComponent(
                      order.customerName
                    )},%20regarding%20your%20FITTEE%20order%20${order.orderNumber}...`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-[12px] font-semibold text-emerald-800 dark:text-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8C8B83]">
                      Shipping Destination
                    </h4>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Ekart Serviceable
                    </span>
                  </div>

                  <p className="text-[13px] text-[#161714] dark:text-[#F2F1EC] leading-relaxed">
                    <span className="font-bold">{order.shippingAddress.fullName}</span>
                    <br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    <span className="font-mono font-bold">{order.shippingAddress.pincode}</span>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  icon={copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  className="w-full mt-2"
                >
                  {copiedAddress ? 'Address Copied!' : 'Copy Full Address'}
                </Button>
              </div>
            </div>

            {/* Courier Event Log & Timeline */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-4">
              <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC] uppercase tracking-wider">
                Fulfillment & Courier Timeline
              </h3>

              <div className="space-y-4 pl-2 border-l-2 border-[#E7E5DF] dark:border-[#2A2C27] ml-2">
                {order.timeline.map((entry, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#B87A22] ring-4 ring-white dark:ring-[#161815]" />
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                        {entry.status}
                      </span>
                      <span className="text-[11px] font-mono text-[#8C8B83]">
                        {formatIST(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">{entry.note}</p>
                    {entry.actor && (
                      <span className="text-[10px] text-[#8C8B83] italic">By {entry.actor}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-3 border-t border-[#E7E5DF] flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal warehouse or courier note..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#E7E5DF] text-[12.5px] bg-[#FAFAF7]"
                />
                <Button variant="secondary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                  Save Note
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Ekart Dispatch Engine */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
              <div>
                <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC] uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B87A22]" />
                  <span>Ekart Dispatch Engine</span>
                </h3>
                <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
                  Direct API booking with Ekart Logistics Surface / Air
                </p>
              </div>

              {/* Dispatch Pre-checks Checklist */}
              <div className="p-3.5 rounded-lg bg-[#FAFAF7] dark:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C8B83]">
                  Dispatch Pre-Checks
                </p>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex items-center gap-2 text-[#2F7D4F]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Payment verified ({order.paymentMethod})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2F7D4F]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Address complete with 6-digit pincode</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2F7D4F]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Pincode serviceable ({order.shippingAddress.pincode})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2F7D4F]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Inventory stock reserved & allocated</span>
                  </div>
                </div>
              </div>

              {/* Dispatch Action Box */}
              {order.awbNumber ? (
                <div className="p-4 rounded-xl bg-[#2F7D4F]/10 border border-[#2F7D4F]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#2F7D4F] font-bold text-[13px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shipment Booked with Ekart</span>
                  </div>
                  <div className="font-mono text-[13px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                    AWB: {order.awbNumber}
                  </div>
                  <p className="text-[11.5px] text-[#24633E]">
                    Manifest: {order.manifestId} • {order.courierName}
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowLabelModal(true)}
                      icon={<Printer className="w-3.5 h-3.5" />}
                      className="w-full"
                    >
                      Print 4x6&quot; Shipping Label
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDispatch}
                    disabled={!canDispatch || isDispatching}
                    isLoading={isDispatching}
                    icon={<Truck className="w-4 h-4" />}
                    className="w-full shadow-md"
                  >
                    Dispatch with Ekart
                  </Button>
                  <p className="text-[11px] text-[#8C8B83] text-center">
                    Protected by Idempotency Key to prevent duplicate shipments.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Status Override for Operators */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-3">
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8C8B83]">
                Update Order Stage
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      updateOrderStatus(order.id, st);
                      success('Status Updated', `Order marked as ${st}`);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11.5px] font-semibold border text-center transition-colors ${
                      order.status === st
                        ? 'bg-[#B87A22] text-white border-[#B87A22]'
                        : 'bg-[#FAFAF7] hover:bg-[#F0EFEA] text-[#161714] border-[#E7E5DF]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <ConfirmDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          cancelOrder(order.id, cancelReason || 'Cancelled by admin operator');
          setShowCancelModal(false);
          success('Order Cancelled', 'Order transitioned to CANCELLED state and stock returned.');
        }}
        title="Cancel Customer Order"
        description="This will cancel fulfillment, notify customer, and initiate refund if prepaid."
        confirmWord="CANCEL"
        confirmText="Confirm Cancellation"
        variant="danger"
      />

      {/* Thermal Label 4x6" Modal Preview */}
      {showLabelModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-xl border border-black/20 shadow-2xl font-mono text-[11px] space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-sm tracking-tight">EKART LOGISTICS</span>
              <button onClick={() => setShowLabelModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-[14px]">AWB: {order.awbNumber}</p>
              <p className="text-[10px]">ROUTING: RNC-EAST-HUB-PRIORITY</p>
              <div className="py-2 bg-gray-100 text-center font-bold tracking-widest text-lg border">
                |||||||||||||||||||||||||||||||
              </div>
            </div>

            <div className="border-t pt-2 space-y-1">
              <p className="font-bold">SHIP TO:</p>
              <p className="font-semibold text-xs">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>PH: {order.shippingAddress.phone}</p>
            </div>

            <div className="border-t pt-2 flex justify-between">
              <span>ORDER: {order.orderNumber}</span>
              <span>TYPE: {order.paymentMethod} ({formatINR(order.totalAmount)})</span>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  window.print();
                  setShowLabelModal(false);
                }}
                className="w-full font-sans"
              >
                Send to Thermal Printer (4x6&quot;)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GST Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] p-6 rounded-xl border border-[#E7E5DF] dark:border-[#2A2C27] shadow-2xl text-[12px] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E5DF] dark:border-[#2A2C27] pb-3">
              <div>
                <h3 className="font-bold text-base">TAX INVOICE</h3>
                <p className="text-xs text-[#8C8B83]">FITTEE APPAREL PRIVATE LIMITED</p>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="p-1 text-[#8C8B83] hover:text-[#161714] dark:hover:text-[#F2F1EC]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p><strong>Invoice No:</strong> INV-2026-0894</p>
                <p><strong>Date:</strong> {formatIST(order.createdAt, { dateOnly: true })}</p>
                <p><strong>GSTIN:</strong> 20AAACF1942L1Z4</p>
              </div>
              <div>
                <p><strong>Billed To:</strong> {order.customerName}</p>
                <p><strong>Place of Supply:</strong> {order.shippingAddress.state} (Jharkhand)</p>
              </div>
            </div>

            <table className="w-full border-t border-b text-xs">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-1">Item</th>
                  <th className="py-1">HSN</th>
                  <th className="py-1">Qty</th>
                  <th className="py-1 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id} className="border-b last:border-none">
                    <td className="py-1.5">{i.productTitle}</td>
                    <td className="py-1.5">61091000</td>
                    <td className="py-1.5">{i.quantity}</td>
                    <td className="py-1.5 text-right font-mono">{formatINR(i.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right space-y-1 font-mono">
              <p>Subtotal: {formatINR(order.subtotal)}</p>
              <p>CGST (2.5%): {formatINR(Math.round(order.totalAmount * 0.025))}</p>
              <p>SGST (2.5%): {formatINR(Math.round(order.totalAmount * 0.025))}</p>
              <p className="font-bold text-sm">Total: {formatINR(order.totalAmount)}</p>
            </div>

            <Button variant="primary" size="md" onClick={() => setShowInvoiceModal(false)} className="w-full">
              Download PDF Invoice
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
