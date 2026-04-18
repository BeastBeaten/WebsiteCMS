'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Tag, Space, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, TextArea } = Typography;
const { RangePicker } = DatePicker;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  categoryId: string | null;
  category: { name: string } | null;
  publishedAt: string | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ArticlesPage() {
  const [data, setData] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form] = Form.useForm();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/categories'),
      ]);
      const articles = await articlesRes.json();
      const cats = await categoriesRes.json();
      setData(articles);
      setCategories(cats);
    } catch {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Article) => {
    setEditingArticle(record);
    form.setFieldsValue({
      ...record,
      publishedAt: record.publishedAt ? dayjs(record.publishedAt) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchArticles();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const payload = {
        ...values,
        publishedAt: values.publishedAt ? (values.publishedAt as dayjs.Dayjs).toISOString() : null,
      };

      if (editingArticle) {
        await fetch(`/api/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('更新成功');
      } else {
        await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchArticles();
    } catch {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<Article> = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: 'slug', dataIndex: 'slug', key: 'slug', width: 150 },
    {
      title: '栏目',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (name: string) => name || <Text type="secondary">-</Text>,
    },
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
        <Title level={3} style={{ margin: 0 }}>文章管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加文章</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
      <Modal
        title={editingArticle ? '编辑文章' : '添加文章'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="栏目">
            <Select allowClear placeholder="选择栏目">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="excerpt" label="摘要">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="coverImage" label="封面图URL">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={10} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="DRAFT">
            <Select>
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
              <Select.Option value="ARCHIVED">已归档</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="publishedAt" label="发布时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
