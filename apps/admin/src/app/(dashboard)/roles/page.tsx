'use client';

import { useState } from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const roles = [
  {
    name: '管理员',
    key: 'ADMIN',
    color: 'red',
    permissions: ['全部权限'],
    description: '拥有系统所有权限',
  },
  {
    name: '员工',
    key: 'EMPLOYEE',
    color: 'blue',
    permissions: [
      '文章管理',
      '栏目管理',
      '媒体库',
      '页面管理',
      '可视化编辑器',
      '个人设置',
    ],
    description: '内容编辑人员权限',
  },
];

const menuPermissions = [
  { label: '仪表盘', key: 'dashboard' },
  { label: '用户管理', key: 'users' },
  { label: '角色权限', key: 'roles' },
  { label: '文章管理', key: 'articles' },
  { label: '栏目管理', key: 'categories' },
  { label: '媒体库', key: 'media' },
  { label: '页面管理', key: 'pages' },
  { label: '可视化编辑器', key: 'editor' },
  { label: '个人设置', key: 'settings' },
];

export default function RolesPage() {
  return (
    <div>
      <Title level={3}>角色权限管理</Title>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {roles.map((role) => (
          <Card key={role.key} title={
            <Space>
              <LockOutlined />
              <span>{role.name}</span>
            </Space>
          }>
            <p><Text type="secondary">描述：</Text>{role.description}</p>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">权限：</Text>
              <div style={{ marginTop: 8 }}>
                {role.permissions.map((p) => (
                  <Tag key={p} color={p === '全部权限' ? role.color : undefined}>
                    {p}
                  </Tag>
                ))}
              </div>
            </div>
            {role.key === 'EMPLOYEE' && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">菜单权限：</Text>
                <div style={{ marginTop: 8 }}>
                  {menuPermissions.map((m) => (
                    <Tag key={m.key} color="green">{m.label}</Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </Space>
    </div>
  );
}
