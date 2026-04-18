'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Modal, message, Card, Image, Typography, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

interface Media {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export default function MediaPage() {
  const [data, setData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      setData(json);
    } catch {
      message.error('获取媒体列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/media',
    headers: { authorization: 'authorization-text' },
    onSuccess: (res) => {
      message.success('上传成功');
      fetchMedia();
    },
    onError: () => {
      message.error('上传失败');
    },
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchMedia();
    } catch {
      message.error('删除失败');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>媒体库</Title>
        <Upload {...uploadProps} showUploadList={false}>
          <Button type="primary" icon={<PictureOutlined />}>上传文件</Button>
        </Upload>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {data.map((item) => (
          <Card
            key={item.id}
            hoverable
            cover={
              item.mimeType.startsWith('image/') ? (
                <Image
                  src={item.url}
                  alt={item.filename}
                  height={150}
                  style={{ objectFit: 'cover' }}
                  preview={{ visible: false }}
                  onClick={() => {
                    setPreviewImage(item.url);
                    setPreviewOpen(true);
                  }}
                />
              ) : (
                <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                  <Text type="secondary">{item.mimeType}</Text>
                </div>
              )
            }
            actions={[
              <Popconfirm key="delete" title="确定删除?" onConfirm={() => handleDelete(item.id)}>
                <DeleteOutlined />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={<Text ellipsis={{ tooltip: item.filename }}>{item.filename}</Text>}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{formatSize(item.size)}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString('zh-CN')}</Text>
                </Space>
              }
            />
          </Card>
        ))}
      </div>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
