import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Navbar from './components/layout/Navbar.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Admin Pages
import Dashboard from './pages/admin/Dashboard.jsx';
import Products from './pages/admin/Products.jsx';
import Users from './pages/admin/Users.jsx';
import Orders from './pages/admin/Orders.jsx';
import Categories from './pages/admin/Categories.jsx';
import Settings from './pages/admin/Settings.jsx';

const { Content, Footer } = Layout;

// Ant Design theme
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <Content style={{ padding: isAdminRoute ? 0 : '0 50px', marginTop: isAdminRoute ? 0 : 64 }}>
        <div style={{ padding: isAdminRoute ? 0 : 24, minHeight: 380 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Products />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Users />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Orders />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Categories />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Settings />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
        </div>
      </Content>
      {!isAdminRoute && (
        <Footer style={{ textAlign: 'center' }}>
          Laptop Shop ©2024 Created by Son Nguyen
        </Footer>
      )}
    </Layout>
  );
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
