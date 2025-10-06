import React from 'react';
import { Card, Typography, Form, Input, Button, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Title } = Typography;

const ProfilePage = () => {
  const { user } = useAuth();

  const onFinish = (values) => {
    console.log('Profile update values:', values);
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                style={{ marginBottom: '16px' }}
              />
              <Title level={4}>{user?.fullName || 'User'}</Title>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card title="Edit Profile">
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                username: user?.username || '',
                email: user?.email || '',
                fullName: user?.fullName || '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please input a valid email!' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
