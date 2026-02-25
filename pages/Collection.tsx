
import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store/store';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { generateGalleryBackground } from '../services/geminiService';

const Collection: React.FC = () => {
  const { products } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Painting' | 'Sketch' | 'Craft' | 'Keychain'>('All');
  const [galleryBg, setGalleryBg] = useState<string | null>(null);

  useEffect(() => {
    const loadGalleryBg = async () => {
      const bg = await generateGalleryBackground();
      if (bg) setGalleryBg(bg);
    };
    loadGalleryBg();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product =>
        categoryFilter === 'All' || product.category === categoryFilter
      )
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm, categoryFilter]);

  const categories: ('All' | 'Painting' | 'Sketch' | 'Craft' | 'Keychain')[] = ['All', 'Painting', 'Sketch', 'Craft', 'Keychain'];

  return (
    <div className="collection-page fade-in">
        <section className="gallery-hero" style={{ backgroundImage: galleryBg ? `url(${galleryBg})` : 'none' }}>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="slide-up-fade-in">Our Collection</h1>
                <p className="slide-up-fade-in" style={{animationDelay: '0.2s'}}>
                    A curated selection of celestial art and handcrafted treasures.
                </p>
            </div>
        </section>

        <div className="container main-content">
            {/* Filters and Search */}
        <div className="filters-bar slide-up-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="search-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                    type="text"
                    placeholder="Search artworks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input"
                />
            </div>
            <div className="category-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`filter-button ${categoryFilter === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
            <div className="product-grid stagger-children">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="no-results">
                <p>No artworks match your criteria.</p>
            </div>
        )}
        </div>
         {/* FIX: Removed invalid 'jsx' prop from style tag. */}
         <style>{`
            .collection-page { padding-bottom: 6rem; }
            
            .gallery-hero {
                height: 50vh;
                display: flex;
                align-items: center;
                text-align: center;
                background-color: #f5f5f5;
                background-size: cover;
                background-position: center;
                position: relative;
                margin-bottom: 4rem;
                overflow: hidden;
            }
            .hero-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
                z-index: 1;
            }
            .hero-content {
                position: relative;
                z-index: 2;
                width: 100%;
            }
            .gallery-hero h1 { 
                font-size: 4.5rem; 
                margin-bottom: 1rem;
                color: #000;
                letter-spacing: -0.02em;
            }
            .gallery-hero p { 
                font-size: 1.4rem; 
                color: #444; 
                font-style: italic;
                max-width: 600px;
                margin: 0 auto;
            }
            @media (max-width: 768px) {
                .gallery-hero h1 { font-size: 3rem; }
                .gallery-hero p { font-size: 1.1rem; }
            }

            .main-content {
                padding: 0 2rem;
            }
            
            .filters-bar {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                margin-bottom: 4rem;
                align-items: center;
            }
            @media (min-width: 768px) {
                .filters-bar {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }

            .search-wrapper { position: relative; width: 100%; max-width: 400px; }
            .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
            .search-wrapper .input { padding-left: 45px; border-radius: 50px; }

            .category-filters { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
            .filter-button {
                padding: 10px 24px;
                border: 1px solid #ddd;
                border-radius: 50px;
                background: #fff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                font-size: 0.85rem;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #666;
            }
            .filter-button:hover {
                background: #f9f9f9;
                border-color: #000;
                color: #000;
            }
            .filter-button.active {
                background: #000;
                color: #fff;
                border-color: #000;
            }

            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 3rem;
            }

            .no-results {
                text-align: center;
                padding: 5rem 0;
                font-size: 1.5rem;
                color: #888;
            }
        `}</style>
    </div>
  );
};

export default Collection;
