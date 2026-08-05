import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Heart, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Footer() {
  const { t, tCategory, language } = useLanguage();
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/settings`).then(r => r.json()),
      fetch(`${API}/api/categories?type=product`).then(r => r.json())
    ]).then(([sett, cats]) => {
      setSettings(sett);
      if (Array.isArray(cats)) setCategories(cats);
    }).catch(() => {});
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

            {/* Column 3: Product Categories */}
            <div className="footer-col">
              <h3 className="footer-heading">{language === 'vi' ? 'Danh mục sản phẩm' : language === 'en' ? 'Product Categories' : '产品分类'}</h3>
              <ul className="footer-links">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/san-pham#${cat.slug}`}>
                        {tCategory ? tCategory(cat, 'name') : cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link to="/san-pham#amino-acid-bien-sau">{language === 'vi' ? 'Phụ phẩm Từ Mực Biển' : language === 'en' ? 'Squid By-products' : '鱿鱼类副产品'}</Link></li>
                    <li><Link to="/san-pham#dinh-duong-tu-tom">{language === 'vi' ? 'Phụ phẩm Từ Tôm' : language === 'en' ? 'Shrimp By-products' : '虾类副产品'}</Link></li>
                    <li><Link to="/san-pham#phu-pham-nuoc-mam">{language === 'vi' ? 'Phụ phẩm Nước Mắm' : language === 'en' ? 'Fish Sauce By-products' : '鱼露类副产品'}</Link></li>
                  </>
                )}
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
