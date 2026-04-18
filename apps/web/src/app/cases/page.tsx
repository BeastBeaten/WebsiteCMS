import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CasesPage() {
  const cases = [
    { title: '某科技公司官网', category: '科技', color: '#667eea' },
    { title: '某医疗集团官网', category: '医疗', color: '#764ba2' },
    { title: '某教育机构官网', category: '教育', color: '#f093fb' },
    { title: '某电商平台', category: '电商', color: '#4facfe' },
    { title: '某金融机构官网', category: '金融', color: '#43e97b' },
    { title: '某餐饮连锁官网', category: '餐饮', color: '#fa709a' },
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
        <h1 style={{ fontSize: 40, fontWeight: 'bold' }}>案例展示</h1>
        <p style={{ marginTop: 16, opacity: 0.9 }}>我们的作品，您的选择</p>
      </div>

      <div style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {cases.map((c, i) => (
            <div key={i} style={{
              background: c.color,
              borderRadius: 8,
              height: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{c.title}</h3>
              <span style={{ opacity: 0.8, fontSize: 14 }}>{c.category}</span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
