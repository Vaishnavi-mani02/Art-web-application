
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { getMoodRecommendation, generateHeroBackground } from '../services/geminiService';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products, setView } = useAppStore();
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [heroBg, setHeroBg] = useState<string | null>(null);

  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    const loadHeroBg = async () => {
      const bg = await generateHeroBackground();
      if (bg) setHeroBg(bg);
    };
    loadHeroBg();
  }, []);

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setIsLoading(true);
    setRecommendation('');
    const result = await getMoodRecommendation(mood);
    setRecommendation(result);
    setIsLoading(false);
  };
  
  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: heroBg ? `url(${heroBg})` : 'none' }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title slide-up-fade-in">
            <span className="nebula-text">Nebula's</span> <span className="art-text">Art</span> <span className="gallery-text">Gallery</span>
          </h1>
          <p className="hero-subtitle slide-up-fade-in" style={{ animationDelay: '0.2s' }}>
            "Capturing the ethereal beauty of the universe in every brushstroke."
          </p>
          <div className="hero-actions slide-up-fade-in" style={{ animationDelay: '0.4s' }}>
            <button onClick={() => setView('collection')} className="button button-primary">
              Explore Collection
            </button>
            <button onClick={() => setView('contact')} className="button button-outline">
              Commission Work
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container featured-section">
        <h2 className="section-title text-center">Featured Works</h2>
        <div className="product-grid stagger-children-slow">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Mood Matcher */}
      <section className="mood-matcher-section">
          <div className="container">
            <h2 className="section-title text-center">Mood Matcher</h2>
            <p className="section-subtitle text-center">Describe your current feeling, and let our AI suggest the perfect art style for you.</p>
            <form onSubmit={handleMoodSubmit} className="mood-form">
              <input 
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g., peaceful, energetic, nostalgic..."
                className="input"
              />
              <button type="submit" disabled={isLoading} className="button button-primary">
                {isLoading ? 'Thinking...' : 'Get Recommendation'}
              </button>
            </form>
            {recommendation && (
              <div className="recommendation-box fade-in">
                <p><strong>Our AI suggests:</strong> {recommendation}</p>
              </div>
            )}
        </div>
      </section>
        {/* FIX: Removed invalid 'jsx' prop from style tag. */}
        <style>{`
            .hero-section {
                height: 90vh;
                display: flex;
                align-items: center;
                text-align: center;
                background-color: #ffffff;
                background-size: cover;
                background-position: center;
                position: relative;
                overflow: hidden;
                transition: background-image 1s ease-in-out;
            }
            .hero-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
                z-index: 1;
            }
            .hero-section::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle at center, rgba(255, 105, 180, 0.1) 0%, transparent 70%);
                z-index: 0;
            }
            .hero-content {
                position: relative;
                z-index: 2;
            }
            .hero-title {
                font-size: 5.5rem;
                font-family: var(--font-serif);
                color: #000000;
                margin-bottom: 1.5rem;
                letter-spacing: -0.03em;
                text-shadow: 0 10px 30px rgba(255, 255, 255, 0.5);
            }
            .hero-title .nebula-text {
                color: #000000;
            }
            .hero-title .art-text {
                color: var(--accent);
            }
            .hero-title .gallery-text {
                color: #000000;
            }
            @media (max-width: 768px) {
                .hero-title { font-size: 3.5rem; }
            }
            .hero-subtitle {
                font-size: 1.6rem;
                font-style: italic;
                margin: 0 auto 3.5rem;
                font-weight: 400;
                color: #333;
                max-width: 800px;
                line-height: 1.6;
                text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
            }
            .hero-actions {
                display: flex;
                gap: 2rem;
                justify-content: center;
            }
            .hero-actions .button-outline {
                border-color: #000;
                color: #000;
            }
            .hero-actions .button-outline:hover {
                background-color: #000;
                color: #fff;
            }
            @media (max-width: 480px) {
                .hero-actions { flex-direction: column; align-items: center; }
            }
            .section-title {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            .section-subtitle {
                font-size: 1.1rem;
                color: #666;
                max-width: 600px;
                margin: 0 auto 2.5rem;
            }
            .featured-section {
                padding: 6rem 2rem;
            }
            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2.5rem;
                margin-top: 4rem;
            }
            .mood-matcher-section {
                background-color: var(--white);
                padding: 6rem 2rem;
            }
            .mood-form {
                display: flex;
                gap: 1rem;
                max-width: 600px;
                margin: 0 auto;
            }
            .recommendation-box {
                max-width: 600px;
                margin: 2rem auto 0;
                padding: 1.5rem;
                border: 1px solid var(--border);
                border-radius: 8px;
                background-color: var(--background);
                font-style: italic;
                color: var(--primary);
            }
        `}</style>
    </div>
  );
};

export default Home;
