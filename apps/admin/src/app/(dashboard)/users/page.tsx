'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import bcrypt from 'bcryptjs';

const { Title } = Typography;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      setData(json);
    } catch {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchUsers();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: { username: string; email: string; password: string; role: string }) => {
    try {
      const payload = { ...values };
      if (values.password) {
        payload.password = await bcrypt.hash(values.password, 10);
      } else {
        delete payload.password;
      }

      if (editingUser) {
        await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('更新成功');
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchUsers();
    } catch {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<User> = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? '管理员' : '员工'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('zh-CN') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>用户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加用户</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: !editingUser, message: '请输入密码' }]}>
            <Input.Password placeholder={editingUser ? '不修改请留空' : ''} />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="EMPLOYEE">员工</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
