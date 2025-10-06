import React from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ProductPage = () => {
  return (
    <div>
      <Title level={2}>Products</Title>
      <Paragraph>This is the products page. Product listing will be implemented here.</Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <img
                alt="Product"
                src="https://via.placeholder.com/300x200"
                style={{ height: 200, objectFit: 'cover' }}
              />
            }
            actions={[
              <Button type="text" icon={<ShoppingCartOutlined />}>
                Add to Cart
              </Button>
            ]}
          >
            <Card.Meta
              title="Sample Product"
              description="This is a sample product description."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
