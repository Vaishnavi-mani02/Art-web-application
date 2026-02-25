
import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Spinner from '../components/Spinner';
import { SHIPPING_COST, COLLECTOR_DISCOUNT_PERCENTAGE } from '../constants';

const Checkout: React.FC = () => {
  const { setView, clearCart, cart, user, promo, placeOrder } = useAppStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const loyaltyDiscount = user?.role === 'collector' ? subtotal * (COLLECTOR_DISCOUNT_PERCENTAGE / 100) : 0;
  const promoDiscount = promo ? subtotal * (promo.discount / 100) : 0;
  const total = subtotal + SHIPPING_COST - loyaltyDiscount - promoDiscount;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
        setIsProcessing(false);
        placeOrder(total);
        setStep(3); // Move to confirmation step
    }, 2000);
  };
  
  if (cart.length === 0 && step !== 3) {
      setView('collection');
      return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border border-brand-border rounded-lg shadow-lg">
      <h1 className="text-3xl font-serif font-bold text-center mb-6">Checkout</h1>
      
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-8 max-w-sm mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand-primary' : 'text-rose-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-brand-primary bg-brand-primary/10' : 'border-rose-300'}`}>1</div>
              <span className="text-sm mt-1">Shipping</span>
          </div>
          <div className={`flex-grow h-0.5 ${step >= 2 ? 'bg-brand-primary' : 'bg-rose-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand-primary' : 'text-rose-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-brand-primary bg-brand-primary/10' : 'border-rose-300'}`}>2</div>
              <span className="text-sm mt-1">Payment</span>
          </div>
          <div className={`flex-grow h-0.5 ${step >= 3 ? 'bg-brand-primary' : 'bg-rose-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand-primary' : 'text-rose-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? 'border-brand-primary bg-brand-primary/10' : 'border-rose-300'}`}>3</div>
              <span className="text-sm mt-1">Confirmation</span>
          </div>
      </div>


      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
          <h2 className="text-2xl font-serif font-bold mb-4">Shipping Information</h2>
          <Input label="Full Name" type="text" required />
          <Input label="Address" type="text" required />
          <Input label="City" type="text" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="State" type="text" required />
            <Input label="ZIP Code" type="text" required />
          </div>
          <Button type="submit" className="w-full mt-4">Continue to Payment</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePayment} className="space-y-4">
          <h2 className="text-2xl font-serif font-bold mb-4">Payment Details</h2>
          <Input label="Card Number" type="text" placeholder="**** **** **** ****" required />
          <Input label="Cardholder Name" type="text" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry Date (MM/YY)" type="text" placeholder="MM/YY" required />
            <Input label="CVC" type="text" placeholder="***" required />
          </div>
          <div className="flex justify-between items-center mt-6">
            <Button type="button" variant="outline" onClick={handleBack}>Back to Shipping</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? <><Spinner size="sm"/> Processing...</> : 'Pay Now'}
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif font-bold text-green-600">Thank You!</h2>
          <p className="text-lg text-brand-text opacity-80">Your order has been placed successfully.</p>
          <p>A confirmation has been sent to your email. Your new art is on its way!</p>
          <Button onClick={() => setView('collection')} className="mt-6">Continue Shopping</Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
