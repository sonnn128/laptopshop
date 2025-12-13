import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setSent(true);
      message.success('Reset link sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      message.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Title level={3}>Check Your Email</Title>
          <Alert
            message="We have sent a password reset link to your email address."
            type="success"
            showIcon
            style={{ marginBottom: 24, textAlign: 'left' }}
          />
          <Text type="secondary">
            Please check your inbox and click the link to reset your password. The link will expire in 24 hours.
          </Text>
          <div style={{ marginTop: 24 }}>
            <Link to="/login">
              <Button type="primary">Back to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Forgot Password</Title>
          <Text type="secondary">Enter your email to reset your password</Text>
        </div>

        <Form
          name="forgot_password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large" loading={loading}>
              Send Reset Link
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login">Back to Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
