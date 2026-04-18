import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  const products = [
    { name: '企业官网建设', desc: '专业的企业官网定制开发服务', icon: '🌐' },
    { name: '可视化编辑器', desc: '拖拽式页面编辑器，所见即所得', icon: '🎨' },
    { name: '内容管理系统', desc: '强大的后台管理，灵活高效', icon: '📊' },
    { name: '移动端适配', desc: '响应式设计，完美适配所有设备', icon: '📱' },
    { name: 'SEO优化', desc: '专业的SEO优化服务，提升排名', icon: '🔍' },
    { name: '技术支持', desc: '7x24小时技术支持，保障稳定运行', icon: '🛡️' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '140px 48px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 'bold' }}>产品服务</h1>
        <p style={{ marginTop: 16, opacity: 0.9 }}>为您提供全方位的网站建设解决方案</p>
      </div>

      <div style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {products.map((p, i) => (
            <div key={i} style={{
              padding: 40,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>{p.name}</h3>
              <p style={{ color: '#666', lineHeight: 1.8 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
