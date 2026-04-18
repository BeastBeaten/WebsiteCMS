'use client';

import { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, Button, Input, Select, Card, Space, message, Dropdown, Tag, Modal } from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  HolderOutlined,
  DeleteOutlined,
  PlusOutlined,
  FontSizeOutlined,
  PictureOutlined,
  BorderOutlined,
  AppstoreOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSearchParams } from 'next/navigation';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface ComponentDef {
  type: string;
  label: string;
  icon: React.ReactNode;
  defaultProps: Record<string, unknown>;
}

interface EditorComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

const COMPONENT_DEFS: ComponentDef[] = [
  { type: 'heading', label: '标题', icon: <FontSizeOutlined />, defaultProps: { level: 1, text: '标题文字' } },
  { type: 'text', label: '文本', icon: <FontSizeOutlined />, defaultProps: { content: '这是一段文本内容' } },
  { type: 'image', label: '图片', icon: <PictureOutlined />, defaultProps: { src: 'https://picsum.photos/800/400', alt: '图片' } },
  { type: 'button', label: '按钮', icon: <BorderOutlined />, defaultProps: { text: '点击按钮', href: '#' } },
  { type: 'divider', label: '分割线', icon: <BorderOutlined />, defaultProps: {} },
  { type: 'grid', label: '栅格', icon: <AppstoreOutlined />, defaultProps: { columns: 2, gap: 16 } },
  { type: 'carousel', label: '轮播', icon: <AppstoreOutlined />, defaultProps: { images: ['https://picsum.photos/800/400'] } },
  { type: 'form', label: '表单', icon: <AppstoreOutlined />, defaultProps: { fields: ['姓名', '电话', '留言'] } },
];

function generateId() {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function SortableItem({ component, onDelete, onSelect, isSelected }: {
  component: EditorComponent;
  onDelete: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: component.id });
  const style = { transform: CSS.Transform.toString(transform), transition, marginBottom: 8 };

  const def = COMPONENT_DEFS.find((d) => d.type === component.type);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: isSelected ? '2px solid #1677ff' : '1px solid #d9d9d9',
        borderRadius: 4,
        padding: 8,
        background: '#fff',
        cursor: 'move',
        position: 'relative',
      }}
      onClick={onSelect}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <span {...attributes} {...listeners} style={{ cursor: 'move' }}>
            <HolderOutlined />
          </span>
          <Tag>{def?.label || component.type}</Tag>
        </Space>
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <ComponentRenderer component={component} />
      </div>
    </div>
  );
}

function ComponentRenderer({ component }: { component: EditorComponent }) {
  const { type, props } = component;
  switch (type) {
    case 'heading': return <Title level={props.level as number}>{props.text as string}</Title>;
    case 'text': return <Text>{props.content as string}</Text>;
    case 'image': return <img src={props.src as string} alt={props.alt as string} style={{ maxWidth: '100%' }} />;
    case 'button': return <Button href={props.href as string}>{props.text as string}</Button>;
    case 'divider': return <hr style={{ border: 'none', borderTop: '1px solid #d9d9d9', margin: '16px 0' }} />;
    case 'grid': return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${props.columns as number}, 1fr)`, gap: props.gap as number }}><div style={{ background: '#f0f0f0', padding: 16, textAlign: 'center' }}>栅格1</div><div style={{ background: '#f0f0f0', padding: 16, textAlign: 'center' }}>栅格2</div></div>;
    case 'carousel': return <div style={{ background: '#f0f0f0', padding: 40, textAlign: 'center' }}>轮播图 ({(props.images as string[]).length}张)</div>;
    case 'form': return <div style={{ background: '#f0f0f0', padding: 16 }}>表单 ({(props.fields as string[]).join(', ')})</div>;
    default: return <div>Unknown: {type}</div>;
  }
}

export default function EditorPage() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('id');
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [components, setComponents] = useState<EditorComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!pageId);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (pageId) {
      fetch(`/api/pages/${pageId}`)
        .then((r) => r.json())
        .then((page) => {
          setPageTitle(page.title);
          setPageSlug(page.slug);
          const content = page.contentJson;
          if (content && content.components) {
            setComponents(content.components as EditorComponent[]);
          }
        })
        .catch(() => message.error('加载页面失败'))
        .finally(() => setLoading(false));
    }
  }, [pageId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        return newItems;
      });
    }
  };

  const addComponent = useCallback((def: ComponentDef) => {
    const newComp: EditorComponent = {
      id: generateId(),
      type: def.type,
      props: { ...def.defaultProps },
    };
    setComponents((prev) => [...prev, newComp]);
    setSelectedId(newComp.id);
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateComponent = useCallback((id: string, newProps: Record<string, unknown>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c))
    );
  }, []);

  const selectedComponent = components.find((c) => c.id === selectedId);

  const handleSave = async () => {
    if (!pageTitle || !pageSlug) {
      message.error('请填写标题和Slug');
      return;
    }
    setSaving(true);
    try {
      const url = pageId ? `/api/pages/${pageId}` : '/api/pages';
      const method = pageId ? 'PUT' : 'POST';
      const body = JSON.stringify({
        title: pageTitle,
        slug: pageSlug,
        contentJson: { components },
        status: 'DRAFT',
      });
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Layout style={{ height: 'calc(100vh - 112px)' }}>
        {/* Left Panel - Component Palette */}
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', padding: 16 }}>
          <Title level={5}>组件</Title>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {COMPONENT_DEFS.map((def) => (
              <Card
                key={def.type}
                size="small"
                hoverable
                style={{ cursor: 'pointer' }}
                onClick={() => addComponent(def)}
              >
                <Space>
                  {def.icon}
                  <span>{def.label}</span>
                </Space>
              </Card>
            ))}
          </Space>
        </Sider>

        {/* Center - Canvas */}
        <Content style={{ padding: 16, overflowY: 'auto', background: '#f5f5f5' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', minHeight: '100%', padding: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="页面标题"
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}
              />
              <Input
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
                placeholder="页面 slug"
              />
            </div>
            <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {components.map((comp) => (
                <SortableItem
                  key={comp.id}
                  component={comp}
                  isSelected={selectedId === comp.id}
                  onSelect={() => setSelectedId(comp.id)}
                  onDelete={() => deleteComponent(comp.id)}
                />
              ))}
            </SortableContext>
            {components.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                从左侧拖拽或点击组件开始编辑
              </div>
            )}
          </div>
        </Content>

        {/* Right Panel - Properties */}
        <Sider width={260} style={{ background: '#fff', borderLeft: '1px solid #f0f0f0', padding: 16 }}>
          <Title level={5}>属性</Title>
          {selectedComponent ? (
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text type="secondary">类型</Text>
                <div><Tag>{COMPONENT_DEFS.find((d) => d.type === selectedComponent.type)?.label}</Tag></div>
              </div>
              {selectedComponent.type === 'heading' && (
                <>
                  <div>
                    <Text type="secondary">级别</Text>
                    <Select
                      value={selectedComponent.props.level as number}
                      onChange={(v) => updateComponent(selectedComponent.id, { level: v })}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value={1}>H1</Select.Option>
                      <Select.Option value={2}>H2</Select.Option>
                      <Select.Option value={3}>H3</Select.Option>
                    </Select>
                  </div>
                  <div>
                    <Text type="secondary">文字</Text>
                    <Input.TextArea
                      value={selectedComponent.props.text as string}
                      onChange={(e) => updateComponent(selectedComponent.id, { text: e.target.value })}
                      rows={2}
                    />
                  </div>
                </>
              )}
              {selectedComponent.type === 'text' && (
                <div>
                  <Text type="secondary">内容</Text>
                  <Input.TextArea
                    value={selectedComponent.props.content as string}
                    onChange={(e) => updateComponent(selectedComponent.id, { content: e.target.value })}
                    rows={4}
                  />
                </div>
              )}
              {selectedComponent.type === 'image' && (
                <>
                  <div>
                    <Text type="secondary">图片URL</Text>
                    <Input
                      value={selectedComponent.props.src as string}
                      onChange={(e) => updateComponent(selectedComponent.id, { src: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text type="secondary">Alt文字</Text>
                    <Input
                      value={selectedComponent.props.alt as string}
                      onChange={(e) => updateComponent(selectedComponent.id, { alt: e.target.value })}
                    />
                  </div>
                </>
              )}
              {selectedComponent.type === 'button' && (
                <>
                  <div>
                    <Text type="secondary">按钮文字</Text>
                    <Input
                      value={selectedComponent.props.text as string}
                      onChange={(e) => updateComponent(selectedComponent.id, { text: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text type="secondary">链接</Text>
                    <Input
                      value={selectedComponent.props.href as string}
                      onChange={(e) => updateComponent(selectedComponent.id, { href: e.target.value })}
                    />
                  </div>
                </>
              )}
              {selectedComponent.type === 'grid' && (
                <div>
                  <Text type="secondary">列数</Text>
                  <Select
                    value={selectedComponent.props.columns as number}
                    onChange={(v) => updateComponent(selectedComponent.id, { columns: v })}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value={2}>2列</Select.Option>
                    <Select.Option value={3}>3列</Select.Option>
                    <Select.Option value={4}>4列</Select.Option>
                  </Select>
                </div>
              )}
            </Space>
          ) : (
            <Text type="secondary">选择一个组件编辑属性</Text>
          )}
          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              block
            >
              保存
            </Button>
          </div>
        </Sider>
      </Layout>
    </DndContext>
  );
}
