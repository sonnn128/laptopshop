import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Spin, message, Input, Select, Pagination } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton.jsx';
import api from '../config/api.js';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const pageSize = 12;

  const navigate = useNavigate();

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage - 1,
        size: pageSize,
        sort: `${sortBy},${sortOrder}`,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await api.get('/products', { params });
      const data = response.data.data || response.data;
      
      if (Array.isArray(data)) {
        const filtered = data.filter(p => (p.quantity ?? p.stock ?? 0) > 0);
        setProducts(filtered);
        setTotalProducts(filtered.length);
      } else if (data.content) {
        const filtered = data.content.filter(p => (p.quantity ?? p.stock ?? 0) > 0);
        setProducts(filtered);
        setTotalProducts(data.totalElements);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data.data || response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split('_');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Products</Title>
      
      {/* Search and Filter Section */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Category"
              allowClear
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Sort by"
              value={`${sortBy}_${sortOrder}`}
              onChange={handleSortChange}
              style={{ width: '100%' }}
            >
              <Option value="id_asc">Newest First</Option>
              <Option value="id_desc">Oldest First</Option>
              <Option value="name_asc">Name A-Z</Option>
              <Option value="name_desc">Name Z-A</Option>
              <Option value="price_asc">Price Low to High</Option>
              <Option value="price_desc">Price High to Low</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Products Grid */}
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  style={{ height: 200, objectFit: 'cover' }}
                  onClick={() => handleProductClick(product.id)}
                />
              }
              actions={[
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 8px' }}>
                  <AddToCartButton 
                    product={product} 
                    size="small"
                    showQuantity={false}
                    compact={true}
                  />
                </div>
              ]}
            >
              <Card.Meta
                title={
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        ${product.price ? Number(product.price).toLocaleString() : '0'}
                      </Text>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {product.factory && `by ${product.factory}`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Stock: {product.quantity || 0}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalProducts > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} products`
            }
          />
        </div>
      )}

      {products.length === 0 && !loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text type="secondary">No products found</Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductPage;
