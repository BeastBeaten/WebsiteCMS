'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Layout, Menu, theme, Typography, Dropdown, Avatar, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
  FolderOutlined,
  PictureOutlined,
  AppstoreOutlined,
  BuildOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems: MenuProps['items'] = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/roles', icon: <LockOutlined />, label: '角色权限' },
  { key: '/articles', icon: <FileTextOutlined />, label: '文章管理' },
  { key: '/categories', icon: <FolderOutlined />, label: '栏目管理' },
  { key: '/media', icon: <PictureOutlined />, label: '媒体库' },
  { key: '/pages', icon: <AppstoreOutlined />, label: '页面管理' },
  { key: '/editor', icon: <BuildOutlined />, label: '可视化编辑器' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        加载中...
      </div>
    );
  }

  if (!session) return null;

  const userMenuItems: MenuProps['items'] = [
    { key: 'settings', icon: <SettingOutlined />, label: '个人设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      signOut({ callbackUrl: '/login' });
    } else if (key === 'settings') {
      router.push('/settings');
    }
  };

  const selectedKey = menuItems.find(item => item?.key === pathname)?.key as string || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>WebsiteCMS</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{
          background: colorBgContainer,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{session.user.name}</span>
              <span style={{ fontSize: 12, color: '#999' }}>({session.user.role === 'ADMIN' ? '管理员' : '员工'})</span>
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24 }}>
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 'calc(100vh - 112px)',
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
