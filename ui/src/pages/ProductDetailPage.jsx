import React from 'react';
import { Card, Typography, Button, Row, Col, InputNumber } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <img
            src="https://via.placeholder.com/500x400"
            alt="Product"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={2}>Product Name</Title>
            <Paragraph style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
              $999.99
            </Paragraph>
            <Paragraph>
              This is a detailed product description. It includes all the features and specifications
              of the product that customers need to know before making a purchase decision.
            </Paragraph>
            
            <div style={{ margin: '24px 0' }}>
              <Paragraph strong>Quantity:</Paragraph>
              <InputNumber min={1} defaultValue={1} style={{ width: '100px' }} />
            </div>
            
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
              Add to Cart
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;
