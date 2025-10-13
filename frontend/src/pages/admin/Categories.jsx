import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/adminService.js';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message,
  Popconfirm,
  Typography,
  Card,
  Tag,
  Image,
  Row,
  Col,
  Select
} from 'antd';

const { Option } = Select;
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      // Ensure we always set an array
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories from API');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      message.error('Failed to delete category');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values);
        message.success('Category updated successfully');
      } else {
        await categoryService.create(values);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      message.error('Failed to save category');
    }
  };


  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="category"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => (
        <Tag color="blue">{count} products</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description="This action cannot be undone and will affect all products in this category."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
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
          <Title level={2} style={{ margin: 0 }}>Categories Management</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            Add Category
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={categories}
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
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{editingCategory ? 'Edit Category' : 'Add New Category'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Category Name"
                rules={[{ required: true, message: 'Please input category name!' }]}
              >
                <Input placeholder="e.g., Gaming Laptops" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please input slug!' }]}
              >
                <Input placeholder="e.g., gaming-laptops" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Describe this category..."
              showCount
              maxLength={200}
            />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Category Image URL"
            rules={[{ required: true, message: 'Please input image URL!' }]}
          >
            <Input placeholder="https://example.com/category-image.jpg" />
          </Form.Item>

          {form.getFieldValue('image') && (
            <Form.Item label="Image Preview">
              <Image
                width={200}
                height={120}
                src={form.getFieldValue('image')}
                alt="Category preview"
                style={{ objectFit: 'cover', borderRadius: 8 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
              />
            </Form.Item>
          )}
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
            initialValue="active"
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
