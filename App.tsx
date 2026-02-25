
import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
// FIX: Import newly routed pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const { currentView, viewParams, checkUserSession, fetchProducts } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [animationClass, setAnimationClass] = useState('fade-in');

  useEffect(() => {
    const initializeApp = async () => {
      await checkUserSession();
      await fetchProducts();
      setIsInitialized(true);
    };
    initializeApp();
  }, [checkUserSession, fetchProducts]);
  
  useEffect(() => {
    setAnimationClass('fade-out');
    const timer = setTimeout(() => {
      setAnimationClass('fade-in');
    }, 500); // Match this with CSS animation duration
    return () => clearTimeout(timer);
  }, [currentView, viewParams]);


  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'collection':
        return <Collection />;
      case 'product':
        return <ProductDetails productId={viewParams as string} />;
      case 'contact':
        return <Contact />;
      // FIX: Add cases for new views to enable full app functionality.
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'signin':
        return <SignIn />;
      case 'signup':
        return <SignUp />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  if (!isInitialized) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary)' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Loading Gallery...</p>
          </div>
      );
  }

  return <Layout><div className={animationClass}>{renderView()}</div></Layout>;
};

export default App;
