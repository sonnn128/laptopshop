import React, { useEffect } from 'react';
import { Card, Typography, Button, Table, InputNumber, Empty, Spin, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CartPage = () => {
  const { 
    cartItems, 
    totalPrice, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    loadCartFromServer 
  } = useCart();
  const navigate = useNavigate();

  // Load cart from server when component mounts
  useEffect(() => {
    loadCartFromServer();
  }, []);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleQuantityChange = async (productId, value) => {
    if (value && value > 0) {
      await updateQuantity(productId, value);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
    message.success('Item removed from cart');
  };

  const handleClearCart = async () => {
    await clearCart();
    message.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={record.image || 'https://via.placeholder.com/60x60?text=No+Image'} 
            alt={text}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            {record.factory && (
              <div style={{ color: '#666', fontSize: '12px' }}>by {record.factory}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`,
      width: 120,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber 
          min={1} 
          max={99}
          value={quantity} 
          onChange={(value) => handleQuantityChange(record.id, value)}
          disabled={loading}
        />
      ),
      width: 120,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `$${(record.price * record.quantity).toLocaleString()}`,
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
          loading={loading}
        >
          Remove
        </Button>
      ),
      width: 100,
    },
  ];

  if (loading && cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Title level={2}>Shopping Cart</Title>
        <Card>
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description="Your cart is empty"
            style={{ padding: '50px 0' }}
          >
            <Button type="primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Shopping Cart ({cartItems.length} items)</Title>
        <Button 
          danger 
          onClick={handleClearCart}
          loading={loading}
        >
          Clear Cart
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          rowKey="id"
          loading={loading}
        />
        
        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'right'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <Title level={3} style={{ margin: 0 }}>
              Total: ${totalPrice.toLocaleString()}
            </Title>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button 
              size="large"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
            <Button 
              type="primary" 
              size="large"
              onClick={handleCheckout}
              loading={loading}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CartPage;
