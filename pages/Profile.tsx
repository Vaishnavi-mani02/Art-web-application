
import React from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';

const Profile: React.FC = () => {
  const { user, setView, wishlist, products, orders } = useAppStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!user) {
    // This should ideally not happen if routes are protected, but as a fallback:
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Please sign in to view your profile.</h2>
        <Button onClick={() => setView('signin')} className="mt-4">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold">Collector's Dashboard</h1>
        <p className="text-xl text-brand-primary">Welcome back, {user.fullName}!</p>
      </div>

      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif font-bold mb-4">Profile Information</h2>
        <div className="space-y-2">
            <p><span className="font-semibold text-brand-primary">Name:</span> {user.fullName}</p>
            <p><span className="font-semibold text-brand-primary">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-brand-primary">Status:</span> <span className="capitalize bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full text-sm">{user.role}</span></p>
        </div>
      </div>

      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif font-bold mb-4">Order History</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 border border-brand-border rounded-md flex justify-between items-center hover:bg-rose-50 transition-colors">
                <div>
                  <p className="font-bold text-lg">{order.id}</p>
                  <p className="text-sm text-brand-primary opacity-70">{order.date}</p>
                  <p className="text-sm mt-1 font-medium">{order.items.join(', ')}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-brand-accent">₹{order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-primary opacity-70">You haven't placed any orders yet.</p>
        )}
      </div>

      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlistProducts.map(product => (
              <div 
                key={product.id} 
                className="flex items-center gap-4 p-3 border border-brand-border rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                onClick={() => setView('product', product.id)}
              >
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="font-bold font-serif">{product.name}</h3>
                  <p className="text-sm text-brand-accent">₹{product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-brand-primary opacity-70">Your wishlist is empty. Start exploring to find art that speaks to you.</p>
            <Button onClick={() => setView('collection')} className="mt-4">Explore Collection</Button>
          </div>
        )}
      </div>
      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif font-bold mb-4">Discover More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map(product => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => setView('product', product.id)}
            >
              <div className="aspect-square overflow-hidden rounded-lg mb-2">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <h3 className="text-sm font-bold truncate">{product.name}</h3>
              <p className="text-xs text-brand-accent">₹{product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-6"
          onClick={() => setView('collection')}
        >
          View Full Collection
        </Button>
      </div>
    </div>
  );
};

export default Profile;
