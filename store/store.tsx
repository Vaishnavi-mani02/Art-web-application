
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
// FIX: Import new types and services.
import { Product, User, View, Review, CartItem, Promo, Order } from '../types';
import { getProducts, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, checkSession, createReview, updateProduct, createProduct } from '../services/supabaseService';
import { validateCreativePromoCode } from '../services/geminiService';

interface AppState {
  products: Product[];
  user: User | null;
  currentView: View;
  viewParams: string | null;
  // FIX: Add cart and promo to state.
  cart: CartItem[];
  promo: Promo | null;
  wishlist: string[]; // Array of product IDs
  orders: Order[];
  loading: boolean;
  error: string | null;
}

interface AppActions {
  setView: (view: View, params?: string) => void;
  fetchProducts: () => Promise<void>;
  checkUserSession: () => Promise<void>;
  submitReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  // FIX: Add missing actions.
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signUp: (fullName: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleProductStatus: (productId: string, isSoldOut: boolean) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => Promise<void>;
  toggleWishlist: (productId: string) => void;
  placeOrder: (total: number) => void;
}

const AppContext = createContext<(AppState & AppActions) | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    products: [],
    user: null,
    currentView: 'home',
    viewParams: null,
    // FIX: Initialize new state properties.
    cart: [],
    promo: null,
    wishlist: [],
    orders: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => setState(prev => ({ ...prev, loading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error, loading: false }));

  const setView = (view: View, params?: string) => {
    setState(prev => ({ ...prev, currentView: view, viewParams: params || null, error: null }));
    window.scrollTo(0, 0);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const products = await getProducts();
      // Add a mock keychain if none exist for demo
      if (!products.some(p => p.category === 'Keychain')) {
        products.push({
          id: 'mock-keychain-1',
          name: 'Nebula Keychain',
          description: 'A beautiful celestial keychain.',
          price: 1500.00, // Updated to a more Rupee-like value for mock
          category: 'Keychain',
          imageUrl: 'https://picsum.photos/seed/keychain/400/400',
          isSoldOut: false,
          reviews: []
        });
      }
      setState(prev => ({ ...prev, products }));
    } catch (e: any) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
        const user = await checkSession();
        if (user) {
            setState(prev => ({ ...prev, user }));
        }
    } catch (e: any) {
        console.error("Error checking session:", e.message);
        setError("Could not connect to the server.");
    }
  }, []);
  
  const submitReview = async (productId: string, rating: number, comment: string): Promise<boolean> => {
    if (!state.user) {
        // Mock user for demo purposes if not logged in
        const mockUserId = 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6'; // A valid UUID from a mock user
        console.warn("No user session found, using mock user for review.");
        
        setLoading(true);
        setError(null);
        try {
            await createReview(productId, mockUserId, rating, comment);
            await fetchProducts();
            return true;
        } catch(e: any) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    setLoading(true);
    setError(null);
    try {
        await createReview(productId, state.user.id, rating, comment);
        await fetchProducts(); // Refetch products to show new review
        return true;
    } catch(e: any) {
        setError(e.message);
        return false;
    } finally {
        setLoading(false);
    }
  };

  // FIX: Implement missing actions.
  const addToCart = useCallback((product: Product) => {
    setState(prev => {
      const existingItem = prev.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { product, quantity: 1 }],
      };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.product.id !== productId),
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setState(prev => {
      if (quantity <= 0) {
        return {
          ...prev,
          cart: prev.cart.filter(item => item.product.id !== productId),
        };
      }
      return {
        ...prev,
        cart: prev.cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }));
  }, []);

  const applyPromoCode = useCallback(async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await validateCreativePromoCode(code);
      setState(prev => ({ ...prev, promo: { ...result, code }, loading: false }));
    } catch (e: any) {
      setError("Failed to validate promo code.");
    }
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    
    // Hardcoded admin credentials check
    if (email === 'vaishnavi@gmail.com' && pass === 'vaishnavi@2005') {
      const adminUser: User = {
        id: 'hardcoded-admin-special-user',
        email: 'vaishnavi@gmail.com',
        fullName: 'Vaishnavi (Admin)',
        role: 'admin',
      };
      setState(prev => ({
        ...prev,
        user: adminUser,
        currentView: 'home',
        loading: false,
      }));
      return; // Bypass Supabase call
    }

    try {
      const user = await supabaseSignIn(email, pass);
      if (user) {
        setState(prev => ({
          ...prev,
          user,
          currentView: 'home',
          loading: false
        }));
      } else {
        setError("Sign in failed. Please check your credentials.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during sign in.");
    }
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await supabaseSignUp(fullName, email, pass);
      if (user) {
        setState(prev => ({ ...prev, user, currentView: 'home', loading: false }));
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during sign up.");
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabaseSignOut();
      setState(prev => ({ ...prev, user: null, currentView: 'home' }));
    } catch (e: any) {
      setError("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleProductStatus = useCallback(async (productId: string, isSoldOut: boolean) => {
    setLoading(true);
    try {
      if (state.user?.id === 'hardcoded-admin-special-user' || productId.startsWith('mock-')) {
        // Update local state for demo purposes
        setState(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === productId ? { ...p, isSoldOut } : p)
        }));
      } else {
        await updateProduct(productId, { isSoldOut });
        await fetchProducts();
      }
    } catch (e: any) {
      setError("Failed to update product status.");
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, state.user?.id]);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'reviews'>) => {
    setLoading(true);
    try {
      if (state.user?.id === 'hardcoded-admin-special-user') {
        // Add to local state for demo purposes
        const newProd: Product = {
          ...product,
          id: `mock-${Date.now()}`,
          reviews: []
        };
        setState(prev => ({
          ...prev,
          products: [newProd, ...prev.products]
        }));
      } else {
        await createProduct(product);
        await fetchProducts();
      }
    } catch (e: any) {
      setError("Failed to add new product.");
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, state.user?.id]);


  const toggleWishlist = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      wishlist: prev.wishlist.includes(productId)
        ? prev.wishlist.filter(id => id !== productId)
        : [...prev.wishlist, productId]
    }));
  }, []);

  const placeOrder = useCallback((total: number) => {
    setState(prev => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString().split('T')[0],
        total,
        items: prev.cart.map(item => item.product.name),
        status: 'pending'
      };
      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        cart: [],
        promo: null
      };
    });
  }, []);

  const value = useMemo(() => ({
    ...state,
    setView,
    fetchProducts,
    checkUserSession,
    submitReview,
    // FIX: Provide new actions through context.
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    login,
    signUp,
    logout,
    toggleProductStatus,
    addProduct,
    toggleWishlist,
    placeOrder,
  }), [state, fetchProducts, checkUserSession, addToCart, removeFromCart, updateQuantity, clearCart, applyPromoCode, login, signUp, logout, toggleProductStatus, addProduct, toggleWishlist, placeOrder]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};