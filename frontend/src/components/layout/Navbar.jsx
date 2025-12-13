import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Input } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  LaptopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import CartIcon from '../CartIcon.jsx';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'My Orders',
      onClick: () => navigate('/orders')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const adminMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin')
    },
    {
      key: 'products',
      icon: <LaptopOutlined />,
      label: 'Products',
      onClick: () => navigate('/admin/products')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Orders',
      onClick: () => navigate('/admin/orders')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/admin/users')
    }
  ];

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>
    },
    {
      key: '/products',
      icon: <LaptopOutlined />,
      label: <Link to="/products">Products</Link>
    }
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) {
      return [path];
    }
    return [path];
  };

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', padding: '0 24px', height: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 40, height: 40, background: themeMode !== 'light' ? '#303030' : 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LaptopOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          </div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>Laptop Shop</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '0 1 auto', minWidth: 0 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={getSelectedKeys()}
            items={menuItems}
            style={{ display: 'flex', gap: 8 }}
          />
        </div>

        <div style={{ flex: '1 1 360px', minWidth: 160, maxWidth: 520, display: 'flex', alignItems: 'center' }}>
          <Input.Search
            placeholder="Search products..."
            onSearch={(v) => navigate(`/products?search=${encodeURIComponent(v)}`)}
            enterButton
            size="middle"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button type="text" onClick={() => navigate('/wishlist')} style={{ color: 'white' }}>
          ❤️ Favorites
        </Button>
        <CartIcon />

        <Button
          type="text"
          icon={<BulbOutlined />}
          style={{ color: 'white' }}
          onClick={() => {
            const nextMode = themeMode === 'light' ? 'dark' : (themeMode === 'dark' ? 'system' : 'light');
            setThemeMode(nextMode);
          }}
          title={`Theme: ${themeMode}`}
        />

        {user ? (
          <>
            {isAdmin() && (
              <Dropdown
                menu={{ items: adminMenuItems }}
                placement="bottomRight"
              >
                <Button type="text" style={{ color: 'white' }}>
                  <SettingOutlined /> Admin
                </Button>
              </Dropdown>
            )}

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Avatar
                style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                icon={<UserOutlined />}
              >
                {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
              </Avatar>
            </Dropdown>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="text"
              icon={<LoginOutlined />}
              style={{ color: 'white' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </Header >
  );
};

export default Navbar;
