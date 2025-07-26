// src/components/admin/OrderModal.tsx
'use client';

import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  contact: string;
  email: string;
  address: string;
  cartItems: OrderItem[];
  status: 'pending' | 'dispatched';
  orderValue: number;
  deliveryCharges?: number;
  discountApplied?: number;
  paymentReceived: number;
  createdAt: any;
  dispatchedAt?: any;
}

interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderModal({ order, onClose, onUpdate }: OrderModalProps) {
  const [paymentReceived, setPaymentReceived] = useState(order.paymentReceived || 0);
  const [deliveryCharges, setDeliveryCharges] = useState(order.deliveryCharges || 0);
  const [discountApplied, setDiscountApplied] = useState(order.discountApplied || 0);
  const [loading, setLoading] = useState(false);

  const handleDispatch = async () => {
    if (paymentReceived <= 0) {
      alert('Please enter payment received amount');
      return;
    }

    setLoading(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'dispatched',
        paymentReceived,
        deliveryCharges,
        discountApplied,
        dispatchedAt: serverTimestamp(),
      });

      // Send dispatch email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order-dispatched',
          data: {
            customerName: order.customerName,
            customerEmail: order.email,
            orderValue: order.orderValue,
            cartItems: order.cartItems,
            deliveryCharges,
            discountApplied,
            paymentReceived,
          },
        }),
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error dispatching order:', error);
      alert('Failed to dispatch order');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-charcoal">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-charcoal mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Contact:</span> {order.contact}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
              <p><span className="font-medium">Address:</span> {order.address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-charcoal mb-3">Order Items</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartItems.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">₹{item.price}</td>
                      <td className="px-4 py-2 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-charcoal mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Order Value:</span> ₹{order.orderValue}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
              <p><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</p>
              {order.dispatchedAt && (
                <p><span className="font-medium">Dispatch Date:</span> {formatDate(order.dispatchedAt)}</p>
              )}
            </div>
          </div>

          {/* Dispatch Form (for pending orders) */}
          {order.status === 'pending' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Mark as Dispatched</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Received (₹) *
                  </label>
                  <input
                    type="number"
                    value={paymentReceived}
                    onChange={(e) => setPaymentReceived(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    min="0"
                    max={order.orderValue + deliveryCharges - discountApplied}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={deliveryCharges}
                    onChange={(e) => setDeliveryCharges(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Applied (₹)
                  </label>
                  <input
                    type="number"
                    value={discountApplied}
                    onChange={(e) => setDiscountApplied(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Final Amount:</span> ₹
                  {(order.orderValue + deliveryCharges - discountApplied).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleDispatch}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Mark as Dispatched'}
              </button>
            </div>
          )}

          {/* Dispatched Order Summary */}
          {order.status === 'dispatched' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-3">Payment Details</h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">Order Value:</span> ₹{order.orderValue}</p>
                <p><span className="font-medium">Delivery Charges:</span> ₹{order.deliveryCharges || 0}</p>
                <p><span className="font-medium">Discount Applied:</span> ₹{order.discountApplied || 0}</p>
                <p className="text-lg"><span className="font-medium">Total Paid:</span> ₹{order.paymentReceived}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}