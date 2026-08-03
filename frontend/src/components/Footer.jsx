import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Heart, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Footer() {
  const { t, language } = useLanguage();
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
                {t('hero.desc')}
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
              <h3 className="footer-heading">{language === 'vi' ? 'Liên kết nhanh' : language === 'en' ? 'Quick Links' : '快速链接'}</h3>
              <ul className="footer-links">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/gioi-thieu/cong-ty">{t('nav.aboutCompany')}</Link></li>
                <li><Link to="/gioi-thieu/hinh-anh">{t('nav.gallery')}</Link></li>
                <li><Link to="/san-pham">{t('nav.products')}</Link></li>
                <li><Link to="/tin-tuc">{t('nav.news')}</Link></li>
                <li><Link to="/lien-he">{t('nav.contact')}</Link></li>
              </ul>
            </div>

            {/* Column 3: Products */}
            <div className="footer-col">
              <h3 className="footer-heading">{t('nav.products')}</h3>
              <ul className="footer-links">
                <li><Link to="/san-pham/bot-vo-dau-tom">{language === 'vi' ? 'Bột vỏ đầu tôm' : language === 'en' ? 'Shrimp Shell Powder' : '虾壳粉'}</Link></li>
                <li><Link to="/san-pham/dich-muc-thuy-phan-100">{language === 'vi' ? 'Dịch mực thủy phân 100%' : language === 'en' ? '100% Squid Hydrolysate Liquid' : '100% 鱿鱼水解膏'}</Link></li>
                <li><Link to="/san-pham/dich-muc-thuy-phan-plus">{language === 'vi' ? 'Dịch mực thủy phân Plus' : language === 'en' ? 'Squid Hydrolysate Liquid Plus' : '强效鱿鱼水解膏'}</Link></li>
                <li><Link to="/san-pham/cao-gan-muc">{language === 'vi' ? 'Cao gan mực' : language === 'en' ? 'Squid Liver Paste (Soluble)' : '乌贼膏（鱿鱼膏）'}</Link></li>
                <li><Link to="/san-pham/bot-noi-tang-muc">{language === 'vi' ? 'Bột nội tạng mực' : language === 'en' ? 'Squid Viscera Powder' : '鱿鱼内脏粉'}</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col">
              <h3 className="footer-heading">{t('nav.contact')}</h3>
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
                  <span>
                    {settings.workingHours || 
                     (language === 'vi' ? 'T2 - T7: 7:30 - 17:00' : 
                      language === 'en' ? 'Mon - Sat: 7:30 - 17:00' : 
                      '周一至周六: 7:30 - 17:00')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} {language === 'vi' ? 'Công ty TNHH Giải pháp Dinh dưỡng Đồng Tâm. Tất cả quyền được bảo lưu.' : language === 'en' ? 'Dong Tam Feed Solutions Co., Ltd. All Rights Reserved.' : '同心饲料营养解决方案有限公司。保留所有权利。'}</p>
          <p className="footer-credit">
            {language === 'vi' ? 'Thiết kế với ' : language === 'en' ? 'Designed with ' : '精心设计 '}
            <Heart size={12} fill="var(--green-400)" color="var(--green-400)" />
            {language === 'vi' ? ' bởi Đồng Tâm Team' : language === 'en' ? ' by Dong Tam Team' : ' 由 同心团队'}
          </p>
        </div>
      </div>
    </footer>
  );
}
