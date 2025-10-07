import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar } from 'antd';
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
  DashboardOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import CartIcon from '../CartIcon.jsx';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
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
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginRight: '24px' }}>
        Laptop Shop
      </div>
      
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <CartIcon />

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
    </Header>
  );
};

export default Navbar;
