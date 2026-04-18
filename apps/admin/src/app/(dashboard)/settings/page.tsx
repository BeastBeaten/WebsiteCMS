'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import bcrypt from 'bcryptjs';

const { Title } = Typography;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { oldPassword: string; newPassword: string }) => {
    setLoading(true);
    try {
      const hashedOld = await bcrypt.hash(values.oldPassword, 10);
      const hashedNew = await bcrypt.hash(values.newPassword, 10);
      const res = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: hashedOld, newPassword: hashedNew }),
      });
      if (res.ok) {
        message.success('密码修改成功');
        form.resetFields();
      } else {
        const json = await res.json();
        message.error(json.error || '修改失败');
      }
    } catch {
      message.error('修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>个人设置</Title>
      <Card style={{ maxWidth: 500 }}>
        <p><strong>用户名：</strong>{session?.user?.name}</p>
        <p><strong>角色：</strong>{session?.user?.role === 'ADMIN' ? '管理员' : '员工'}</p>
        <div style={{ marginTop: 24 }}>
          <Title level={5}>修改密码</Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}>
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              修改密码
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
