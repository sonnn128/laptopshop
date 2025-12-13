import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      if (result.success) {
        message.success('Login successful!');

        // Check role and redirect accordingly
        // We need to re-check isAdmin because state might update async, 
        // but login return should have enough info or we can check the result data
        // Ideally useAuth provides a way to check user object from result

        // Let's assume the user state in context is updated or we check the returned data
        const user = result.data.user || result.data.data.user;
        const isAdmin = user?.roles?.some(r => r.name === 'ADMIN' || r.name === 'ROLE_ADMIN') || user?.role === 'ADMIN';

        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2}>Login</Title>
          <Paragraph>Welcome back! Please login to your account.</Paragraph>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or</Divider>

        <div style={{ textAlign: 'center' }}>
          <Paragraph>
            Don't have an account? <Link to="/register">Register here</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
