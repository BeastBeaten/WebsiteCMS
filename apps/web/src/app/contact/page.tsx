'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '140px 48px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 'bold' }}>联系我们</h1>
        <p style={{ marginTop: 16, opacity: 0.9 }}>期待与您的合作</p>
      </div>

      <div style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: 28, marginBottom: 32 }}>联系方式</h2>
            <div style={{ lineHeight: 2.5, fontSize: 16 }}>
              <p><strong>📍 地址：</strong>某某市某某区某某路某某大厦</p>
              <p><strong>📞 电话：</strong>400-888-8888</p>
              <p><strong>📧 邮箱：</strong>info@example.com</p>
              <p><strong>🕐 时间：</strong>周一至周五 9:00-18:00</p>
            </div>
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>在线沟通</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {['💬', '📱', '✉️'].map((icon, i) => (
                  <div key={i} style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: '#f0f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    cursor: 'pointer',
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <h2 style={{ fontSize: 24, marginBottom: 24 }}>在线留言</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>提交成功！</h3>
                <p style={{ color: '#666' }}>我们会在24小时内与您联系</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>姓名 *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>电话 *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>邮箱</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>留言 *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14, resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                >
                  提交留言
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
