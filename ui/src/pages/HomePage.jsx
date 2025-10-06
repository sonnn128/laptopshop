import React from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { LaptopOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const features = [
    {
      title: 'Latest Laptops',
      description: 'Discover the newest laptop models with cutting-edge technology',
      icon: <LaptopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
    },
    {
      title: 'Easy Shopping',
      description: 'Simple and secure shopping experience with fast checkout',
      icon: <ShoppingCartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
    },
    {
      title: 'Quality Guarantee',
      description: 'All products come with warranty and quality assurance',
      icon: <LaptopOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        marginBottom: '60px',
        borderRadius: '8px'
      }}>
        <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '20px' }}>
          Welcome to Laptop Shop
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
          Discover the latest laptops with the best prices and quality guarantee
        </Paragraph>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button type="primary" size="large" href="/products">
            Browse Products
          </Button>
          <Button size="large" href="/login" style={{ color: 'white', borderColor: 'white' }}>
            Login
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '60px' }}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <div style={{ marginBottom: '24px' }}>
                {feature.icon}
              </div>
              <Title level={3}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <Card style={{ textAlign: 'center', background: '#f8f9fa' }}>
        <Title level={2}>Ready to Find Your Perfect Laptop?</Title>
        <Paragraph style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
          Browse our extensive collection of laptops from top brands
        </Paragraph>
        <Button type="primary" size="large" href="/products">
          Shop Now
        </Button>
      </Card>
    </div>
  );
};

export default HomePage;
