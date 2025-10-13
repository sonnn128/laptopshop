import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import api from '../config/api.js';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: values.email });
      message.success('If the email exists, a reset link has been sent');
    } catch (error) {
      message.error('Unable to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <Card title="Forgot password" style={{ width: 420 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Send reset link</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
