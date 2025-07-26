// Firestore Document Types
export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  order: number;
}

export interface Item {
  id: string;
  subcategoryId: string;
  name: string;
  price: number;
  inStock: boolean;
  imageUrl?: string; // Keep for backward compatibility
  images?: string[]; // New: array of image URLs
  description: string;
  order?: number;
}

export interface CartItem {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  contact: string;
  email: string;
  address: string;
  cartItems: Array<{
    itemId: string;
    quantity: number;
    name: string;
    price: number;
  }>;
  status: 'pending' | 'dispatched';
  orderValue: number;
  deliveryCharges?: number;
  discountApplied?: number;
  paymentReceived: number;
  createdAt: any; // Firestore Timestamp
  dispatchedAt?: any; // Firestore Timestamp
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
}

// Form Types
export interface CheckoutForm {
  customerName: string;
  contact: string;
  email: string;
  address: string;
}

export interface AdminDispatchForm {
  paymentReceived: number;
  deliveryCharges?: number;
  discountApplied?: number;
}

// Cart Store Type
export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Email Template Data
export interface OrderPlacedEmailData {
  customerName: string;
  orderValue: number;
  cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface NewOrderEmailData {
  customerName: string;
  orderId: string;
  orderValue: number;
  contact: string;
  email: string;
}

export interface OrderDispatchedEmailData {
  customerName: string;
  cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  orderValue: number;
  deliveryCharges?: number;
  discountApplied?: number;
  paymentReceived: number;
}