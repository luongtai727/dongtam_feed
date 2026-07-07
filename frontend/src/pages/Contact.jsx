import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contact() {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Nội dung.');
      return;
    }
    const phoneClean = form.phone.replace(/[\s\-\.]/g, '');
    if (!/^(0|\+84)\d{9,10}$/.test(phoneClean)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0901234567).');
      return;
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch {
      setError('Gửi thất bại. Vui lòng thử lại.');
    }
    setSending(false);
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Liên hệ</span>
          </div>
          <h1 className="page-title">Liên hệ</h1>
          <p className="page-desc">Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info animate-fade-in-left" style={{ opacity: 0 }}>
              <h2>Thông tin liên hệ</h2>
              <p>Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="cc-icon"><MapPin size={22} /></div>
                  <div>
                    <h4>Văn phòng</h4>
                    <p>{settings.address || 'KCN Suối Dầu, Cam Lâm, Khánh Hòa'}</p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><Phone size={22} /></div>
                  <div>
                    <h4>Điện thoại</h4>
                    <p>{settings.phone || '0258 3 123 456'}</p>
                    <p>Hotline: <strong>{settings.hotline || '0901 234 567'}</strong></p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><Mail size={22} /></div>
                  <div>
                    <h4>Email</h4>
                    <p>{settings.email || 'info@dongtamfeed.vn'}</p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><Clock size={22} /></div>
                  <div>
                    <h4>Giờ làm việc</h4>
                    <p>{settings.workingHours || 'T2 - T7: 7:30 - 17:00'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper animate-fade-in-right" style={{ opacity: 0 }}>
              {sent ? (
                <div className="contact-success">
                  <CheckCircle size={48} />
                  <h3>Gửi thành công!</h3>
                  <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                  <button className="btn btn-primary" onClick={() => setSent(false)}>Gửi yêu cầu mới</button>
                </div>
              ) : (
                <>
                  <h2>Gửi yêu cầu liên hệ</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Họ và tên *</label>
                        <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nhập họ và tên" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Số điện thoại *</label>
                        <input type="tel" className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Nhập số điện thoại" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Nhập email" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Công ty</label>
                        <input type="text" className="form-input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Tên công ty" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Chủ đề</label>
                      <input type="text" className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Chủ đề liên hệ" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nội dung *</label>
                      <textarea className="form-textarea" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Nhập nội dung cần tư vấn..." rows="5"></textarea>
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button type="submit" className="btn btn-primary btn-lg" disabled={sending} style={{ width: '100%' }}>
                      {sending ? 'Đang gửi...' : <><Send size={18} /> Gửi yêu cầu</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Map */}
          {settings.mapEmbed && (
            <div className="contact-map">
              <iframe src={settings.mapEmbed} width="100%" height="400" style={{ border: 0, borderRadius: 'var(--radius-lg)' }} allowFullScreen loading="lazy" title="Bản đồ"></iframe>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
