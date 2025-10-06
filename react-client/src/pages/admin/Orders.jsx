import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Select, 
  message,
  Typography,
  Card,
  Tag,
  Descriptions,
  Badge
} from 'antd';
import { 
  EyeOutlined, 
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { orderService } from '../../services/adminService';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll();
      // Handle Page object response
      const data = response.data || response;
      if (data && data.content) {
        // It's a Page object
        setOrders(Array.isArray(data.content) ? data.content : []);
      } else if (Array.isArray(data)) {
        // It's a direct array
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Failed to fetch orders from API');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedOrder(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      message.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge status="warning" text="Pending" />;
      case 'processing': return <Badge status="processing" text="Processing" />;
      case 'completed': return <Badge status="success" text="Completed" />;
      case 'cancelled': return <Badge status="error" text="Cancelled" />;
      default: return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                icon={<CheckOutlined />} 
                onClick={() => handleStatusChange(record.id, 'processing')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Process
              </Button>
              <Button 
                danger
                icon={<CloseOutlined />} 
                onClick={() => handleStatusChange(record.id, 'cancelled')}
              >
                Cancel
              </Button>
            </>
          )}
          {record.status === 'processing' && (
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              onClick={() => handleStatusChange(record.id, 'completed')}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16 
        }}>
          <Title level={2} style={{ margin: 0 }}>Orders Management</Title>
        </div>
        
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Order Number" span={2}>
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {selectedOrder.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                ${selectedOrder.totalAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date" span={2}>
                {selectedOrder.orderDate}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Order Items</Title>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  { title: 'Product Name', dataIndex: 'name', key: 'name' },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  { 
                    title: 'Price', 
                    dataIndex: 'price', 
                    key: 'price',
                    render: (price) => `$${price.toFixed(2)}`
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
