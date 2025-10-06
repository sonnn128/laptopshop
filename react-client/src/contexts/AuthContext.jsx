import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '../config/api.js';
import { isAdmin as isAdminFromJWT, getTokenInfo } from '../utils/jwt.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token) {
      // Try to get user from localStorage first (faster)
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setLoading(false);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }
      
      // Then verify with API
      api.get('/auth/profile')
        .then(response => {
          const userData = response.data.data || response.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch((error) => {
          console.error('API profile error:', error);
          // Don't remove token immediately, might be network issue
          // Only remove if it's 401 unauthorized
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const responseData = response.data.data || response.data;
      const { token, user: userData } = responseData;
      
      console.log('Login response:', { responseData, userData, token });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    // First check JWT token for authorities
    const token = localStorage.getItem('token');
    if (token) {
      const tokenInfo = getTokenInfo(token);
      console.log('JWT token info:', tokenInfo);
      
      if (tokenInfo) {
        const hasAdminAuthority = isAdminFromJWT(token);
        console.log('JWT authorities check:', { 
          authorities: tokenInfo.authorities, 
          hasAdminAuthority,
          isExpired: tokenInfo.isExpired 
        });
        
        // Only return true if token is not expired and has ADMIN authority
        if (!tokenInfo.isExpired && hasAdminAuthority) {
          return true;
        }
      }
    }
    
    // Fallback: Check if user has ADMIN role
    if (!user) return false;
    
    // Check if user has roles array and ADMIN role
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(role => role.name === 'ADMIN' || role.name === 'ROLE_ADMIN');
    }
    
    // Fallback: check if user.role is ADMIN (single role)
    if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
      return true;
    }
    
    // Fallback: check if username is admin (for testing)
    if (user.username === 'admin') {
      return true;
    }
    
    return false;
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
