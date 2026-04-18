'use client';

import { useState, useEffect } from 'react';
import { Tree, Button, Modal, Form, Input, message, Popconfirm, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Title } = Typography;

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      setData(json);
    } catch {
      message.error('获取栏目列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const buildTree = (categories: Category[], parentId: string | null = null): DataNode[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        title: (
          <Space>
            <span>{c.name}</span>
            <Button icon={<EditOutlined />} size="small" type="text" onClick={(e) => {
              e.stopPropagation();
              handleEdit(c);
            }} />
            <Popconfirm title="确定删除?" onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(c.id);
            }}>
              <Button icon={<DeleteOutlined />} size="small" type="text" danger onClick={(e) => e.stopPropagation()} />
            </Popconfirm>
          </Space>
        ),
        key: c.id,
        children: buildTree(categories, c.id),
      }));
  };

  const flatToTree = (categories: Category[], parentId: string | null = null): Category[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        ...c,
        children: flatToTree(categories, c.id),
      }));
  };

  const handleAdd = (pid: string | null = null) => {
    setEditingCategory(null);
    setParentId(pid);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setParentId(record.parentId);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchCategories();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: { name: string; slug: string }) => {
    try {
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('更新成功');
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, parentId }),
        });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      message.error('操作失败');
    }
  };

  const treeData = buildTree(flatToTree(data));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>栏目管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(null)}>添加顶级栏目</Button>
      </div>
      <Tree
        treeData={treeData}
        loading={loading}
        defaultExpandAll
        titleRender={(nodeData) => nodeData.title}
      />
      <Modal
        title={editingCategory ? '编辑栏目' : '添加栏目'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="栏目名称" rules={[{ required: true, message: '请输入栏目名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入slug' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
