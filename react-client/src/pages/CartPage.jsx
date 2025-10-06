import React from 'react';
import { Card, Typography, Button, Table, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CartPage = () => {
  // Mock cart data
  const cartItems = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      price: 2499,
      quantity: 1,
      image: 'https://via.placeholder.com/100x80'
    },
    {
      id: 2,
      name: 'Dell XPS 13',
      price: 1299,
      quantity: 2,
      image: 'https://via.placeholder.com/100x80'
    }
  ];

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={record.image} 
            alt={text}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber 
          min={1} 
          value={quantity} 
          onChange={(value) => console.log('Update quantity:', value)}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `$${record.price * record.quantity}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => console.log('Remove item:', record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <Title level={2}>Shopping Cart</Title>
      
      <Card>
        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          rowKey="id"
        />
        
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'right'
        }}>
          <Title level={3}>Total: ${total.toFixed(2)}</Title>
          <Button type="primary" size="large">
            Proceed to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CartPage;
