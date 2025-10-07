import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Spin, message, Tag, Divider } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton.jsx';
import api from '../config/api.js';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const data = response.data.data || response.data;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      message.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="secondary">Product not found</Text>
        <br />
        <Button type="primary" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/products')}
        style={{ marginBottom: '16px' }}
      >
        Back to Products
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <img
            src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={2}>{product.name}</Title>
            
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '24px', color: '#1890ff', fontWeight: 'bold' }}>
                ${product.price?.toLocaleString()}
              </Text>
            </div>

            {product.factory && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Manufacturer: </Text>
                <Tag color="blue">{product.factory}</Tag>
              </div>
            )}

            {product.category && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Category: </Text>
                <Tag color="green">{product.category.name || product.category}</Tag>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Stock: </Text>
              <Tag color={product.quantity > 0 ? 'green' : 'red'}>
                {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </Tag>
            </div>

            <Divider />

            <Paragraph style={{ fontSize: '16px' }}>
              {product.description || 'No description available for this product.'}
            </Paragraph>

            {product.target && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Target Audience: </Text>
                <Text>{product.target}</Text>
              </div>
            )}

            <Divider />

            <div style={{ marginBottom: '24px' }}>
              <AddToCartButton 
                product={product} 
                size="large"
                showQuantity={true}
              />
            </div>

            {product.quantity === 0 && (
              <div style={{ 
                padding: '12px', 
                background: '#fff2f0', 
                border: '1px solid #ffccc7',
                borderRadius: '6px',
                marginTop: '16px'
              }}>
                <Text type="danger">
                  This product is currently out of stock. Please check back later.
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;
