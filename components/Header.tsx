
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { ShoppingBag, User, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { setView, user, cart, logout, currentView } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <button onClick={() => setView('home')} className="logo-container">
          <Sparkles className="logo-icon" size={24} />
          <span className="logo-text">
            <span className="nebula-text">Nebula's</span> <span className="art-text">Art</span>
          </span>
        </button>
        
        <nav className="nav-links">
          <button 
            onClick={() => setView('home')} 
            className={currentView === 'home' ? 'active' : ''}
          >
            HOME
          </button>
          <button 
            onClick={() => setView('collection')}
            className={currentView === 'collection' ? 'active' : ''}
          >
            COLLECTION
          </button>
          <button 
            onClick={() => setView('contact')}
            className={currentView === 'contact' ? 'active' : ''}
          >
            CONNECT
          </button>
        </nav>

        <div className="actions">
          <div className="user-menu-container">
            <button 
              onClick={() => user ? setShowUserMenu(!showUserMenu) : setView('signin')} 
              className="action-btn"
            >
              <User size={22} />
            </button>

            {user && showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{user.fullName}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={() => { setView('profile'); setShowUserMenu(false); }}>
                  <User size={16} /> Profile
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => { setView('admin'); setShowUserMenu(false); }}>
                    <ShieldCheck size={16} /> Admin
                  </button>
                )}
                <button onClick={() => { logout(); setShowUserMenu(false); }} className="logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setView('cart')} className="action-btn cart-btn">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
      <style>{`
        .header {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          background-color: var(--white);
          transition: all 0.3s ease;
          border-bottom: 1px solid var(--border);
        }
        .header.scrolled {
          padding: 1rem 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--primary);
          padding: 0;
        }
        .logo-icon {
          color: var(--accent);
        }
        .logo-text {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .nebula-text {
          color: var(--primary);
        }
        .art-text {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          gap: 3rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        @media (max-width: 900px) {
          .nav-links { 
            position: static;
            transform: none;
            gap: 1.5rem;
          }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
        }

        .nav-links button {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--primary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 0;
          position: relative;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .nav-links button:hover, .nav-links button.active {
          opacity: 1;
        }
        .nav-links button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent);
        }
        
        .actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--primary);
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .action-btn:hover {
          transform: scale(1.1);
        }
        
        .cart-btn {
          position: relative;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--accent);
          color: white;
          font-size: 10px;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        
        .user-menu-container {
          position: relative;
        }
        
        .user-dropdown {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          width: 240px;
          background: white;
          border: 1px solid #eeeeee;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          padding: 10px;
          display: flex;
          flex-direction: column;
          animation: slideDown 0.2s ease-out;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-header {
          padding: 12px;
        }
        .user-name {
          font-weight: 700;
          font-size: 15px;
          color: #000000;
        }
        .user-email {
          font-size: 12px;
          color: #888888;
        }
        .dropdown-divider {
          height: 1px;
          background: #eeeeee;
          margin: 8px 0;
        }
        .user-dropdown button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          cursor: pointer;
          transition: background 0.2s;
        }
        .user-dropdown button:hover {
          background: #f9f9f9;
        }
        .logout-btn {
          color: #ff4444 !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
