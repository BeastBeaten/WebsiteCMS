import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
  PictureOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

const { Title } = Typography;

async function getStats() {
  const [userCount, articleCount, pageCount, mediaCount, recentArticles] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.page.count(),
    prisma.media.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
  ]);
  return { userCount, articleCount, pageCount, mediaCount, recentArticles };
}

export default async function DashboardPage() {
  const { userCount, articleCount, pageCount, mediaCount, recentArticles } = await getStats();

  const articleColumns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '栏目', dataIndex: ['category', 'name'], key: 'category', render: (name: string) => name || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'}>
          {status === 'PUBLISHED' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (date: Date) => new Date(date).toLocaleDateString('zh-CN') },
  ];

  return (
    <div>
      <Title level={3}>仪表盘</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={userCount}
              prefix={<UserOutlined />}
              suffix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="文章总数"
              value={articleCount}
              prefix={<FileTextOutlined />}
              suffix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="页面总数"
              value={pageCount}
              prefix={<AppstoreOutlined />}
              suffix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="媒体文件"
              value={mediaCount}
              prefix={<PictureOutlined />}
              suffix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近文章">
        <Table
          columns={articleColumns}
          dataSource={recentArticles.map((a) => ({ ...a, key: a.id }))}
          pagination={false}
        />
      </Card>
    </div>
  );
}
