
import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Product } from '../types';

const Admin: React.FC = () => {
  const { user, setView, products, toggleProductStatus, addProduct, loading } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'reviews'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Painting',
    imageUrl: '',
    isSoldOut: false,
    artistNote: ''
  });

  const salesData = useMemo(() => [
        { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
        { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
    ], []);
    
  const stats = useMemo(() => {
    const totalRevenue = products.filter(p => p.isSoldOut).reduce((sum, p) => sum + p.price, 0);
    const piecesSold = products.filter(p => p.isSoldOut).length;
    const totalPieces = products.length;
    return { totalRevenue, piecesSold, totalPieces };
  }, [products]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(newProduct);
    setIsAdding(false);
    setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'Painting',
        imageUrl: '',
        isSoldOut: false,
        artistNote: ''
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-red-400">Access Denied</h2>
        <p className="mt-4 text-lg text-rose-300">You do not have permission to view this page.</p>
        <Button onClick={() => setView('home')} className="mt-6">Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancel' : 'Add New Artwork'}
        </Button>
      </div>

      {isAdding && (
        <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm slide-up-fade-in">
            <h2 className="text-2xl font-serif font-bold mb-6">Add New Artwork</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Artwork Name</label>
                        <Input 
                            value={newProduct.name} 
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            className="input"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                        >
                            <option value="Painting">Painting</option>
                            <option value="Sketch">Sketch</option>
                            <option value="Craft">Craft</option>
                            <option value="Keychain">Keychain</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <Input 
                            type="number" 
                            value={newProduct.price} 
                            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <Input 
                            value={newProduct.imageUrl} 
                            onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} 
                            placeholder="https://picsum.photos/seed/..."
                            required 
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                            className="textarea h-32"
                            value={newProduct.description} 
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Artist Note (Visible in Reviews)</label>
                        <textarea 
                            className="textarea h-24"
                            value={newProduct.artistNote} 
                            onChange={(e) => setNewProduct({...newProduct, artistNote: e.target.value})} 
                            placeholder="A special message for collectors in the review section..."
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Adding...' : 'Publish Artwork'}
                    </Button>
                </div>
            </form>
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
            <h3 className="text-brand-text opacity-70 text-lg">Total Revenue</h3>
            <p className="text-4xl font-bold text-brand-primary">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
            <h3 className="text-brand-text opacity-70 text-lg">Pieces Sold</h3>
            <p className="text-4xl font-bold text-brand-primary">{stats.piecesSold}</p>
        </div>
        <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
            <h3 className="text-brand-text opacity-70 text-lg">Total Inventory</h3>
            <p className="text-4xl font-bold text-brand-primary">{stats.totalPieces}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif font-bold mb-4">Sales Performance (Mock)</h2>
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="var(--primary)" 
                        tick={{ fill: 'var(--primary)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis 
                        stroke="var(--primary)" 
                        tick={{ fill: 'var(--primary)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                        formatter={(value) => [`₹${value}`, 'Sales']}
                    />
                    <Legend iconType="circle" />
                    <Bar 
                        dataKey="sales" 
                        fill="var(--accent)" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={500}
                        animationEasing="ease-in-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="p-6 bg-white border border-brand-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif font-bold mb-4">Inventory Management</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-brand-border">
                        <th className="p-3">Artwork</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b border-brand-border hover:bg-brand-background">
                            <td className="p-3 font-semibold">{product.name}</td>
                            <td className="p-3 text-brand-text opacity-70">{product.category}</td>
                            <td className="p-3">₹{product.price.toFixed(2)}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${product.isSoldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {product.isSoldOut ? 'In Archive' : 'On Display'}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <Button 
                                    size="sm" 
                                    variant={product.isSoldOut ? 'secondary' : 'outline'}
                                    onClick={() => toggleProductStatus(product.id, !product.isSoldOut)}
                                    disabled={loading}
                                >
                                    {product.isSoldOut ? 'Mark as Available' : 'Mark as Sold'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
