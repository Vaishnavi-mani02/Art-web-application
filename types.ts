
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Painting' | 'Sketch' | 'Craft' | 'Keychain';
  imageUrl: string;
  isSoldOut: boolean;
  artistNote?: string;
  reviews: Review[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin' | 'collector';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// FIX: Add Promo interface for promo code state.
export interface Promo {
  code: string;
  discount: number;
  message: string;
}

// FIX: Extend View type to include all valid pages.
export interface Order {
  id: string;
  date: string;
  total: number;
  items: string[];
  status: 'pending' | 'shipped' | 'delivered';
}

export type View = 'home' | 'collection' | 'product' | 'contact' | 'cart' | 'checkout' | 'signin' | 'signup' | 'profile' | 'admin';
