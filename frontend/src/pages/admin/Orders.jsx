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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Mock data
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (page = 0, size = 10, status = 'ALL') => {
    setLoading(true);
    try {
      let response;
      if (status === 'ALL') {
        response = await orderService.getAll({ page, size });
      } else {
        response = await orderService.getByStatus(status, { page, size });
      }
      
      console.log('Orders API response:', response);
      
      // Handle Page object response
      if (response && response.content) {
        // It's a Page object
        console.log('Page content:', response.content);
        setOrders(Array.isArray(response.content) ? response.content : []);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.totalElements || 0
        }));
      } else if (Array.isArray(response)) {
        // It's a direct array
        console.log('Direct array:', response);
        setOrders(response);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.length
        }));
      } else {
        console.log('No data found');
        setOrders([]);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: 0
        }));
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
      await orderService.updateStatus(orderId, newStatus);
      message.success('Order status updated successfully');
      fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Failed to update order status');
    }
  };

  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    fetchOrders(0, pagination.pageSize, value);
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
      case 'PENDING': return <Badge status="warning" text="Pending" />;
      case 'PROCESSING': return <Badge status="processing" text="Processing" />;
      case 'COMPLETED': return <Badge status="success" text="Completed" />;
      case 'CANCELLED': return <Badge status="error" text="Cancelled" />;
      default: return <Badge status="default" text={status} />;
    }
  };

  // Flexible getters to handle different API response shapes
  const getOrderNumber = (record) => {
    if (!record) return '';
    return record.orderNumber || record.orderNo || record.code || record.id || '';
  };

  const getCustomerName = (record) => {
    if (!record) return '';
    // common shapes
    if (record.customerName) return record.customerName;
    if (record.customer && (record.customer.name || record.customer.fullName)) return record.customer.name || record.customer.fullName;
    if (record.user && (record.user.fullName || record.user.username)) return record.user.fullName || record.user.username;
    if (record.customer && record.customer.user && (record.customer.user.fullName || record.customer.user.username)) return record.customer.user.fullName || record.customer.user.username;
    return record.customer?.name || record.customer?.username || '';
  };

  const getCustomerEmail = (record) => {
    if (!record) return '';
    if (record.customerEmail) return record.customerEmail;
    if (record.customer && record.customer.email) return record.customer.email;
    if (record.user && record.user.email) return record.user.email;
    if (record.customer && record.customer.user && record.customer.user.email) return record.customer.user.email;
    return '';
  };

  const getTotalAmount = (record) => {
    if (record == null) return 0;
    return record.totalAmount ?? record.totalPrice ?? record.total ?? record.amount ?? 0;
  };

  const getOrderDate = (record) => {
    if (!record) return '';
    return record.orderDate || record.createdAt || record.createdDate || record.date || '';
  };

  const getItems = (record) => {
    if (!record) return [];
    return record.items || record.orderItems || record.details || [];
  };

  const columns = [
    {
      title: 'Order Number',
      key: 'orderNumber',
      render: (_, record) => getOrderNumber(record),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div>{getCustomerName(record)}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{getCustomerEmail(record)}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => {
        const amount = getTotalAmount(record);
        return amount ? `$${Number(amount).toFixed(2)}` : '$0.00';
      },
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
      render: (_, record) => getOrderDate(record),
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
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="primary" 
                icon={<CheckOutlined />} 
                onClick={() => handleStatusChange(record.id, 'PROCESSING')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Process
              </Button>
              <Button 
                danger
                icon={<CloseOutlined />} 
                onClick={() => handleStatusChange(record.id, 'CANCELLED')}
              >
                Cancel
              </Button>
            </>
          )}
          {record.status === 'PROCESSING' && (
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              onClick={() => handleStatusChange(record.id, 'COMPLETED')}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
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
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{ width: 150 }}
            placeholder="Filter by status"
          >
            <Option value="ALL">All Orders</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="PROCESSING">Processing</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </div>
        
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
        />
      </Card>

      <Modal
        title={`Order Details - ${getOrderNumber(selectedOrder)}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Order Number" span={2}>
                {getOrderNumber(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {getCustomerName(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {getCustomerEmail(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                ${Number(getTotalAmount(selectedOrder)).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {String(selectedOrder.status || '').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date" span={2}>
                {getOrderDate(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>
                {selectedOrder.shippingAddress || selectedOrder.shippingAddressDetail || ''}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={4}>Order Items</Title>
              <Table
                dataSource={getItems(selectedOrder)}
                columns={[
                  { title: 'Product Name', dataIndex: 'name', key: 'name' },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `$${Number(price || 0).toFixed(2)}`
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
