import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import api from '../config/api.js';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token: values.token, newPassword: values.newPassword });
      message.success('Password has been reset');
      navigate('/login');
    } catch (error) {
      message.error('Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <Card title="Reset password" style={{ width: 420 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="token" rules={[{ required: true }]}>
            <Input placeholder="Reset token" />
          </Form.Item>
          <Form.Item name="newPassword" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="New password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Reset password</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
