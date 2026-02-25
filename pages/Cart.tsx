
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { SHIPPING_COST, COLLECTOR_DISCOUNT_PERCENTAGE } from '../constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, setView, user, promo, applyPromoCode, loading } = useAppStore();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const loyaltyDiscount = useMemo(() => {
    return user?.role === 'collector' ? subtotal * (COLLECTOR_DISCOUNT_PERCENTAGE / 100) : 0;
  }, [user, subtotal]);

  const promoDiscount = useMemo(() => {
    // FIX: The `promo` object in the store does not have an `isValid` property.
    // The discount amount is 0 for invalid codes, so we can calculate based on the presence of `promo`.
    return promo ? subtotal * (promo.discount / 100) : 0;
  }, [promo, subtotal]);
  
  const total = subtotal + SHIPPING_COST - loyaltyDiscount - promoDiscount;
  
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromoCode(promoCodeInput);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-4xl font-serif font-bold">Your Cart is Empty</h2>
        <p className="mt-4 text-lg text-rose-300">Looks like you haven't added any art yet.</p>
        <Button onClick={() => setView('collection')} className="mt-6" size="lg">
          Explore Art
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-brand-border rounded-lg gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-bold font-serif">{product.name}</h3>
                  <p className="text-brand-primary opacity-70">₹{product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-border rounded-md">
                   <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 hover:bg-brand-background"><Minus size={16} /></button>
                   <span className="px-4">{quantity}</span>
                   <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 hover:bg-brand-background"><Plus size={16} /></button>
                </div>
                <p className="font-semibold w-20 text-right">₹{(product.price * quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(product.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="lg:col-span-1 p-6 bg-white border border-brand-border rounded-lg h-fit sticky top-24 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{SHIPPING_COST.toFixed(2)}</span></div>
            {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-green-600"><span>Collector Discount ({COLLECTOR_DISCOUNT_PERCENTAGE}%)</span><span>-₹{loyaltyDiscount.toFixed(2)}</span></div>
            )}
            {/* FIX: Check for promo.discount > 0 to determine validity, instead of non-existent `isValid` property. */}
            {promo && promo.discount > 0 && (
                 <div className="flex justify-between text-green-600"><span>Promo '{promo.code}' ({promo.discount}%)</span><span>-₹{promoDiscount.toFixed(2)}</span></div>
            )}
            <div className="border-t border-brand-border my-2"></div>
            <div className="flex justify-between text-xl font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>

          <form onSubmit={handlePromoSubmit} className="mt-6 space-y-2">
            <Input 
                type="text" 
                placeholder="Creative promo code (e.g. soul)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
            />
            <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                {loading ? 'Validating...' : 'Apply Promo'}
            </Button>
          </form>
          {/* FIX: Use promo.discount > 0 to determine message color, instead of non-existent `isValid` property. */}
          {promo && <p className={`mt-2 text-sm text-center ${promo.discount > 0 ? 'text-green-400' : 'text-red-400'}`}>{promo.message}</p>}


          <Button onClick={() => setView('checkout')} size="lg" className="w-full mt-6">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
