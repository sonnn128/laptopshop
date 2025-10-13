import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, Row, Col, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../config/api.js';

const { Title } = Typography;

const ProfilePage = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const onFinishProfile = async (values) => {
    setLoadingProfile(true);
    try {
      const res = await api.put('/auth/profile', values);
      message.success('Profile updated');
      localStorage.setItem('user', JSON.stringify(res.data.data || res.data));
    } catch (e) {
      message.error('Unable to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const onChangePassword = async (vals) => {
    setLoadingPassword(true);
    try {
      await api.post('/auth/change-password', { oldPassword: vals.oldPassword, newPassword: vals.newPassword });
      message.success('Password changed');
    } catch (e) {
      message.error('Unable to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={100} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
              <Title level={4}>{user?.fullName || 'User'}</Title>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Edit Profile">
            <Form layout="vertical" onFinish={onFinishProfile} initialValues={{
              username: user?.username || '',
              email: user?.email || '',
              fullName: user?.fullName || '',
              phone: user?.phone || '',
              address: user?.address || ''
            }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingProfile}>Update Profile</Button>
              </Form.Item>
            </Form>

            <div style={{ marginTop: 24 }}>
              <Card title="Change password">
                <Form onFinish={onChangePassword}>
                  <Form.Item name="oldPassword" rules={[{ required: true }]}>
                    <Input.Password placeholder="Old password" />
                  </Form.Item>
                  <Form.Item name="newPassword" rules={[{ required: true, min: 6 }]}>
                    <Input.Password placeholder="New password" />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary" loading={loadingPassword}>Change password</Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
