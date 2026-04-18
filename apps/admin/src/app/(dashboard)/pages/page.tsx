'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function PagesPage() {
  const [data, setData] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages');
      const json = await res.json();
      setData(json);
    } catch {
      message.error('获取页面列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleAdd = () => {
    setEditingPage(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Page) => {
    setEditingPage(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOpenEditor = (record: Page) => {
    router.push(`/editor?id=${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchPages();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: { title: string; slug: string; status: string }) => {
    try {
      if (editingPage) {
        await fetch(`/api/pages/${editingPage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('更新成功');
      } else {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchPages();
    } catch {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<Page> = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : status === 'ARCHIVED' ? 'gray' : 'orange'}>
          {status === 'PUBLISHED' ? '已发布' : status === 'ARCHIVED' ? '已归档' : '草稿'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('zh-CN') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<BuildOutlined />} size="small" onClick={() => handleOpenEditor(record)}>编辑</Button>
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
        <Title level={3} style={{ margin: 0 }}>页面管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加页面</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
      <Modal
        title={editingPage ? '编辑页面' : '添加页面'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="DRAFT">
            <Select>
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
              <Select.Option value="ARCHIVED">已归档</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
