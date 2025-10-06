import React from 'react';
import { Card, Typography, Table, Tag } from 'antd';

const { Title } = Typography;

const OrderPage = () => {
  // Mock order data
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      date: '2024-01-15',
      status: 'completed',
      total: 2499.99,
      items: ['MacBook Pro 16"']
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      date: '2024-01-10',
      status: 'processing',
      total: 1299.99,
      items: ['Dell XPS 13']
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      date: '2024-01-05',
      status: 'pending',
      total: 899.99,
      items: ['HP Pavilion 15']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => items.join(', '),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Title level={2}>My Orders</Title>
      
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

export default OrderPage;
