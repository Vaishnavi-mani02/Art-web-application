
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { getArtistInsight } from '../services/geminiService';
import { ArrowLeft, Star, ShoppingCart, Sparkles, Heart } from 'lucide-react';

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { products, setView, addToCart, user, toggleProductStatus, loading, wishlist, toggleWishlist } = useAppStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const product = products.find(p => p.id === productId);
  const isWishlisted = wishlist.includes(productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);
  
  const handleGetInsight = async () => {
    if (!product) return;
    setIsLoadingInsight(true);
    const result = await getArtistInsight(product.name, product.description);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  const handleAddToCart = () => {
    if (product) addToCart(product);
  };
  
  if (!product) {
    return (
      <div className="container text-center" style={{padding: '5rem 0'}}>
        <h2 style={{fontSize: '2rem'}}>Product not found</h2>
        <button onClick={() => setView('collection')} className="button button-primary" style={{marginTop: '2rem'}}>Back to Gallery</button>
      </div>
    );
  }

  return (
    <div className="product-details-page container fade-in">
        <button onClick={() => setView('collection')} className="back-button">
            <ArrowLeft size={20} />
            Back to Gallery
        </button>
        <div className="details-grid">
            <div className="image-column slide-up-fade-in">
                <img src={product.imageUrl} alt={product.name} />
                {product.isSoldOut && (
                    <div className="sold-overlay">SOLD</div>
                )}
            </div>
            
            <div className="info-column slide-up-fade-in" style={{animationDelay: '0.2s'}}>
                <span className="category-tag">{product.category}</span>
                <div className="flex justify-between items-start">
                    <h1 className="product-title">{product.name}</h1>
                    <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={28} fill={isWishlisted ? "var(--accent)" : "none"} stroke={isWishlisted ? "var(--accent)" : "currentColor"} />
                    </button>
                </div>
                <p className="product-price">₹{product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>
                
                <div className="purchase-actions">
                    {!product.isSoldOut ? (
                        <button onClick={handleAddToCart} className="add-to-cart-large">
                            <ShoppingCart size={24} />
                            Add to Collection
                        </button>
                    ) : (
                        <div className="sold-out-message">
                            This masterpiece has already found its home.
                        </div>
                    )}
                </div>

                {user?.role === 'admin' && (
                    <div className="admin-actions mt-8 p-6 bg-rose-50 rounded-xl border border-rose-200 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider mb-3 text-rose-500">Admin Controls</p>
                        <button 
                            onClick={() => toggleProductStatus(product.id, !product.isSoldOut)}
                            className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                product.isSoldOut 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 shadow-lg' 
                                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200 shadow-lg'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : (product.isSoldOut ? 'Mark as Available' : 'Mark as Sold')}
                        </button>
                    </div>
                )}

                <div className="ai-insight-section">
                    <button onClick={handleGetInsight} className="insight-trigger" disabled={isLoadingInsight}>
                        <Sparkles size={20} className={isLoadingInsight ? 'animate-pulse' : ''} />
                        {isLoadingInsight ? "Consulting the stars..." : "Reveal Artist's Insight"}
                    </button>
                    {insight && (
                        <div className="insight-box fade-in">
                            <p>{insight}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section slide-up-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="reviews-title">Collector Reviews</h2>
            
            {product.artistNote && (
                <div className="artist-note-box mb-12 p-6 bg-brand-background border-l-4 border-brand-accent rounded-r-lg shadow-sm italic">
                    <h4 className="text-brand-accent font-bold mb-2 not-italic">Artist's Note:</h4>
                    <p className="text-lg">"{product.artistNote}"</p>
                </div>
            )}

            <div className="reviews-list">
                {product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <h3>{review.author}</h3>
                                <div className="star-rating">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="var(--accent)" stroke="var(--accent)" />)}
                                    {[...Array(5 - review.rating)].map((_, i) => <Star key={i} size={18} stroke="var(--accent)" />)}
                                </div>
                            </div>
                            <p className="review-comment">"{review.comment}"</p>
                        </div>
                    ))
                ) : (
                    <p className="no-reviews">No reviews yet for this piece.</p>
                )}
            </div>
        </div>
        <style>{`
            .product-details-page { padding: 4rem 2rem; }
            .back-button {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary);
                font-weight: 600;
                margin-bottom: 3rem;
                transition: color 0.2s ease;
            }
            .back-button:hover { color: var(--accent); }
            
            .details-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 4rem;
            }
            @media (min-width: 768px) {
                .details-grid { grid-template-columns: 1.2fr 1fr; }
            }
            
            .image-column { position: relative; }
            .image-column img { border-radius: 12px; box-shadow: var(--shadow); width: 100%; object-fit: cover; }
            .sold-overlay {
                position: absolute;
                top: 20px;
                right: 20px;
                background-color: var(--accent);
                color: var(--white);
                padding: 8px 16px;
                border-radius: 30px;
                font-weight: bold;
                font-size: 1rem;
            }
            
            .info-column {
                display: flex;
                flex-direction: column;
            }
            .category-tag {
                display: inline-block;
                padding: 4px 12px;
                background-color: var(--background);
                color: var(--primary);
                border: 1px solid var(--border);
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 1rem;
                width: fit-content;
            }
            .product-title { font-size: 3.5rem; margin-bottom: 1rem; line-height: 1.1; flex: 1; }
            .wishlist-toggle {
                background: none;
                border: none;
                cursor: pointer;
                padding: 10px;
                color: var(--secondary);
                transition: all 0.3s ease;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .wishlist-toggle:hover {
                background-color: var(--background);
                color: var(--accent);
                transform: scale(1.1);
            }
            .wishlist-toggle.active {
                color: var(--accent);
            }
            .product-price { font-size: 2.2rem; font-weight: 600; color: var(--accent); margin-bottom: 1.5rem; }
            .product-description { font-size: 1.15rem; color: var(--text); opacity: 0.8; margin-bottom: 2.5rem; line-height: 1.8; }
            
            .purchase-actions {
                margin-bottom: 3rem;
            }
            .add-to-cart-large {
                width: 100%;
                padding: 18px;
                background-color: var(--primary);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .add-to-cart-large:hover {
                background-color: var(--text);
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            }
            .sold-out-message {
                padding: 20px;
                background: var(--background);
                border: 1px dashed var(--border);
                border-radius: 12px;
                color: var(--secondary);
                text-align: center;
                font-style: italic;
            }

            .ai-insight-section { margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--border); }
            .insight-trigger {
                display: flex;
                align-items: center;
                gap: 10px;
                background: none;
                border: 1px solid var(--primary);
                color: var(--primary);
                padding: 12px 24px;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .insight-trigger:hover {
                background: var(--primary);
                color: white;
            }
            .insight-box {
                margin-top: 1.5rem;
                padding: 2rem;
                border-left: 4px solid var(--accent);
                background-color: var(--white);
                border-radius: 0 12px 12px 0;
                box-shadow: var(--shadow);
            }
            .insight-box p { font-style: italic; color: var(--text); line-height: 1.6; }

            .reviews-section { margin-top: 6rem; border-top: 1px solid var(--border); padding-top: 4rem; }
            .reviews-title { font-size: 2.5rem; margin-bottom: 3rem; text-align: center; }
            .reviews-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 2.5rem;
            }
            .review-card {
                background: var(--white);
                padding: 2rem;
                border-radius: 12px;
                border: 1px solid var(--border);
                box-shadow: var(--shadow);
            }
            .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .review-header h3 { font-size: 1.2rem; font-weight: 600; }
            .star-rating { display: flex; gap: 0.2rem; }
            .review-comment { font-style: italic; color: var(--text); opacity: 0.8; line-height: 1.6; }
            .no-reviews { text-align: center; color: var(--secondary); font-style: italic; }
        `}</style>
    </div>
  );
};

export default ProductDetails;
