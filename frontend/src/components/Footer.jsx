import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Heart, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Footer.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="footer">
      {/* Wave Divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,60 C320,100 420,0 720,50 C1020,100 1120,20 1440,60 L1440,100 L0,100 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Company Info */}
            <div className="footer-col">
              <div className="footer-brand">
                <div className="footer-logo" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/logo.png" alt="Đồng Tâm Feed Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', background: '#fff', padding: '4px', borderRadius: 'var(--radius-sm)' }} />
                </div>
              </div>
              <p className="footer-desc">
                Chuyên cung cấp nguyên liệu thức ăn chăn nuôi chất lượng cao từ phụ phẩm thủy sản. Đối tác tin cậy của hàng trăm doanh nghiệp trên cả nước.
              </p>
              <div className="footer-social">
                <a href={settings.facebook || '#'} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <ExternalLink size={18} />
                </a>
                <a href={`https://zalo.me/${settings.zalo || ''}`} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Zalo">
                  <span style={{ fontWeight: 800, fontSize: '0.7rem' }}>Zalo</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h3 className="footer-heading">Liên kết nhanh</h3>
              <ul className="footer-links">
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/gioi-thieu/cong-ty">Về công ty</Link></li>
                <li><Link to="/gioi-thieu/hinh-anh">Thư viện ảnh</Link></li>
                <li><Link to="/san-pham">Sản phẩm</Link></li>
                <li><Link to="/tin-tuc">Tin tức</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Column 3: Products */}
            <div className="footer-col">
              <h3 className="footer-heading">Sản phẩm</h3>
              <ul className="footer-links">
                <li><Link to="/san-pham/bot-vo-dau-tom">Bột vỏ đầu tôm</Link></li>
                <li><Link to="/san-pham/dich-muc-thuy-phan-100">Dịch mực thủy phân 100%</Link></li>
                <li><Link to="/san-pham/dich-muc-thuy-phan-plus">Dịch mực thủy phân Plus</Link></li>
                <li><Link to="/san-pham/cao-gan-muc">Cao gan mực</Link></li>
                <li><Link to="/san-pham/bot-noi-tang-muc">Bột nội tạng mực</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col">
              <h3 className="footer-heading">Liên hệ</h3>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <MapPin size={16} className="footer-contact-icon" />
                  <span>{settings.address || '159/15/7 Đường số 11, KP10, Phường Trường Thọ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh'}</span>
                </div>
                <div className="footer-contact-item">
                  <Phone size={16} className="footer-contact-icon" />
                  <span>{settings.hotline || '0703 295 692'}</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={16} className="footer-contact-icon" />
                  <span>{settings.email || 'info@dongtamfeed.vn'}</span>
                </div>
                <div className="footer-contact-item">
                  <Clock size={16} className="footer-contact-icon" />
                  <span>{settings.workingHours || 'T2 - T7: 7:30 - 17:00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Đồng Tâm Feed Solutions. Tất cả quyền được bảo lưu.</p>
          <p className="footer-credit">
            Thiết kế với <Heart size={12} fill="var(--green-400)" color="var(--green-400)" /> bởi Đồng Tâm Team
          </p>
        </div>
      </div>
    </footer>
  );
}
