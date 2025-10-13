import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../config/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  // Initialize synchronously so UI renders with persisted favorites immediately
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage', e);
      try { localStorage.removeItem('wishlist'); } catch (_) {}
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  // If user is authenticated, try to hydrate wishlist from server
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!user) return; // only for authenticated users
      try {
        const resp = await api.get('/wishlist');
        const data = resp.data?.data || resp.data || [];
        if (!cancelled && Array.isArray(data)) {
          // server returns WishlistItem with nested product — normalize to product shape
          const products = data.map((it) => it.product || it);
          setItems(products);
        }
      } catch (e) {
        console.warn('Failed to hydrate wishlist from server, keeping local copy', e);
      }
    };

    hydrate();

    return () => { cancelled = true; };
  }, [user]);

  const toggle = (product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      // Update local UI immediately (optimistic)
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];

      // If user is authenticated, sync with server
      if (user) {
        (async () => {
          try {
            if (!exists) {
              await api.post(`/wishlist/${product.id}`);
            } else {
              await api.delete(`/wishlist/${product.id}`);
            }
          } catch (e) {
            console.warn('Wishlist sync failed, will keep local state', e);
            // Optionally revert optimistic update on certain errors — keep simple for now
          }
        })();
      }

      return next;
    });
  };

  const remove = (productId) => setItems((prev) => prev.filter(p => p.id !== productId));

  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  );
};

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WishlistContext;
