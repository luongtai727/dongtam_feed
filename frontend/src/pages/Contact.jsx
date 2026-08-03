import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Contact() {
  const { t, language } = useLanguage();
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
      setError(
        language === 'vi' ? 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Nội dung.' :
        language === 'en' ? 'Please fill in your Name, Phone, and Message.' :
        '请填写您的姓名、电话和留言内容。'
      );
      return;
    }
    const phoneClean = form.phone.replace(/[\s\-\.]/g, '');
    if (!/^(0|\+84)\d{9,10}$/.test(phoneClean)) {
      setError(
        language === 'vi' ? 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0901234567).' :
        language === 'en' ? 'Invalid phone number format. Please enter a valid Vietnamese phone number.' :
        '电话号码格式无效。请输入有效的越南电话号码。'
      );
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
      setError(
        language === 'vi' ? 'Gửi thất bại. Vui lòng thử lại.' :
        language === 'en' ? 'Submission failed. Please try again.' :
        '发送失败，请重试。'
      );
    }
    setSending(false);
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav.home')}</Link>
            <ChevronRight size={14} />
            <span>{t('nav.contact')}</span>
          </div>
          <h1 className="page-title">{t('nav.contact')}</h1>
          <p className="page-desc">{t('contactPage.desc')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info animate-fade-in-left">
              <h2>{language === 'vi' ? 'Thông tin liên hệ' : language === 'en' ? 'Contact Information' : '联系方式'}</h2>
              <p>
                {language === 'vi' ? 'Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.' :
                 language === 'en' ? 'Our team of experts is always ready to support you.' :
                 '我们的专家团队随时准备为您提供支持。'}
              </p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="cc-icon"><MapPin size={22} /></div>
                  <div>
                    <h4>{language === 'vi' ? 'Văn phòng' : language === 'en' ? 'Office' : '办公地址'}</h4>
                    <p>{settings.address || '159/15/7 Đường số 11, KP10, Phường Trường Thọ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh'}</p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><Phone size={22} /></div>
                  <div>
                    <h4>{language === 'vi' ? 'Điện thoại' : language === 'en' ? 'Phone Number' : '联系电话'}</h4>
                    <p>{settings.phone || '0703 295 692'}</p>
                    <p>Hotline: <strong>{settings.hotline || '0703 295 692'}</strong></p>
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
                    <h4>{language === 'vi' ? 'Giờ làm việc' : language === 'en' ? 'Working Hours' : '工作时间'}</h4>
                    <p>
                      {settings.workingHours || 
                       (language === 'vi' ? 'T2 - T7: 7:30 - 17:00' : 
                        language === 'en' ? 'Mon - Sat: 7:30 - 17:00' : 
                        '周一至周六: 7:30 - 17:00')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper animate-fade-in-right">
              {sent ? (
                <div className="contact-success">
                  <CheckCircle size={48} />
                  <h3>{language === 'vi' ? 'Gửi thành công!' : language === 'en' ? 'Sent successfully!' : '发送成功！'}</h3>
                  <p>
                    {language === 'vi' ? 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.' :
                     language === 'en' ? 'Thank you for contacting us. We will get back to you as soon as possible.' :
                     '感谢您的联系。我们将尽快与您取得联系。'}
                  </p>
                  <button className="btn btn-primary" onClick={() => setSent(false)}>
                    {language === 'vi' ? 'Gửi yêu cầu mới' : language === 'en' ? 'Send new request' : '发送新请求'}
                  </button>
                </div>
              ) : (
                <>
                  <h2>{language === 'vi' ? 'Gửi yêu cầu liên hệ' : language === 'en' ? 'Send Contact Request' : '提交留言信息'}</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{language === 'vi' ? 'Họ và tên *' : language === 'en' ? 'Full Name *' : '姓名 *'}</label>
                        <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={language === 'vi' ? 'Nhập họ và tên' : language === 'en' ? 'Enter full name' : '请输入姓名'} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{language === 'vi' ? 'Số điện thoại *' : language === 'en' ? 'Phone Number *' : '电话号码 *'}</label>
                        <input type="tel" className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={language === 'vi' ? 'Nhập số điện thoại' : language === 'en' ? 'Enter phone number' : '请输入电话号码'} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={language === 'vi' ? 'Nhập email' : language === 'en' ? 'Enter email' : '请输入电子邮件'} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{language === 'vi' ? 'Công ty' : language === 'en' ? 'Company Name' : '公司名称'}</label>
                        <input type="text" className="form-input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder={language === 'vi' ? 'Tên công ty' : language === 'en' ? 'Company name' : '公司名称'} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'vi' ? 'Chủ đề' : language === 'en' ? 'Subject' : '留言主题'}</label>
                      <input type="text" className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder={language === 'vi' ? 'Chủ đề liên hệ' : language === 'en' ? 'Subject' : '留言主题'} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'vi' ? 'Nội dung *' : language === 'en' ? 'Message *' : '留言内容 *'}</label>
                      <textarea className="form-textarea" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={language === 'vi' ? 'Nhập nội dung cần tư vấn...' : language === 'en' ? 'Enter your message...' : '请输入留言内容...'} rows="5"></textarea>
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button type="submit" className="btn btn-primary btn-lg" disabled={sending} style={{ width: '100%' }}>
                      {sending ? (language === 'vi' ? 'Đang gửi...' : language === 'en' ? 'Sending...' : '正在发送...') : <><Send size={18} /> {language === 'vi' ? 'Gửi yêu cầu' : language === 'en' ? 'Send Request' : '提交留言'}</>}
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
