
import React from 'react';
import { Product } from '../types';
import { useAppStore } from '../store/store';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setView, addToCart } = useAppStore();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView('product', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="product-card"
    >
      <div className="image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
        />
      </div>
      <div className="card-content">
        <div className="card-header">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
          </div>
          <div className="price-tag">
              {product.isSoldOut ? 'Sold' : `₹${product.price.toFixed(2)}`}
          </div>
        </div>
        
        {!product.isSoldOut && (
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        )}
      </div>

      <style>{`
        .product-card {
          background-color: var(--white);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }
        .image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 85%;
          overflow: hidden;
        }
        .image-wrapper img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .image-wrapper img {
          transform: scale(1.05);
        }
        .card-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .product-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text);
          margin: 0;
          line-height: 1.2;
        }
        .product-category {
          color: var(--secondary);
          font-size: 0.85rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }
        .price-tag {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent);
        }
        .add-to-cart-btn {
          width: 100%;
          padding: 10px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-to-cart-btn:hover {
          background-color: var(--text);
          transform: translateY(-2px);
        }
        .add-to-cart-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
