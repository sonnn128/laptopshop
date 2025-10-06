import React from 'react';
import { Card, Typography, Form, Input, Button, Row, Col } from 'antd';

const { Title } = Typography;

const CheckoutPage = () => {
  const onFinish = (values) => {
    console.log('Checkout values:', values);
  };

  return (
    <div>
      <Title level={2}>Checkout</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Shipping Information">
            <Form
              layout="vertical"
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input />
              </Form.Item>
              
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please input your city!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[{ required: true, message: 'Please input your state!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="zipCode"
                    label="ZIP Code"
                    rules={[{ required: true, message: 'Please input your ZIP code!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Order Summary">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>$2,499.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>$2,499.00</span>
              </div>
            </div>
            
            <Button type="primary" size="large" style={{ width: '100%' }}>
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
