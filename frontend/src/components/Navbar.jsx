import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, MapPin, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const { language, setLanguage, t, tCategory } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const location = useLocation();
  const aboutDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
    fetch(`${API}/api/categories?type=product`).then(r => r.json()).then(setProductCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAboutDropdown(false);
    setProductDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target)) {
        setAboutDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) {
        setProductDropdown(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">
              <Phone size={13} />
              <span>Hotline: {settings.hotline || '0703 295 692'}</span>
            </span>
            <span className="topbar-item">
              <Mail size={13} />
              <span>{settings.email || 'info@dongtamfeed.vn'}</span>
            </span>
          </div>
          <div className="topbar-right">
            <span className="topbar-item">
              <Clock size={13} />
              <span>{settings.workingHours || 'T2 - T7: 7:30 - 17:00'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Đồng Tâm Feed Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', background: '#fff', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-menu">
            <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <Link to="/" className="nav-link">{t('nav.home')}</Link>
            </li>
            <li
              className={`nav-item has-dropdown ${location.pathname.startsWith('/gioi-thieu') ? 'active' : ''}`}
              ref={aboutDropdownRef}
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <span className="nav-link" onClick={() => setAboutDropdown(!aboutDropdown)}>
                {t('nav.about')} <ChevronDown size={14} className={`chevron ${aboutDropdown ? 'rotated' : ''}`} />
              </span>
              <ul className={`dropdown-menu ${aboutDropdown ? 'show' : ''}`}>
                <li><Link to="/gioi-thieu/cong-ty" className="dropdown-item">{t('nav.aboutCompany')}</Link></li>
                <li><Link to="/gioi-thieu/nha-may" className="dropdown-item">{t('nav.factory')}</Link></li>
                <li><Link to="/gioi-thieu/chung-nhan" className="dropdown-item">{t('nav.certs')}</Link></li>
                <li><Link to="/gioi-thieu/hinh-anh" className="dropdown-item">{t('nav.gallery')}</Link></li>
              </ul>
            </li>
            <li
              className={`nav-item has-dropdown ${location.pathname.startsWith('/san-pham') ? 'active' : ''}`}
              ref={productDropdownRef}
              onMouseEnter={() => setProductDropdown(true)}
              onMouseLeave={() => setProductDropdown(false)}
            >
              <Link to="/san-pham" className="nav-link" onClick={(e) => { if (productDropdown) e.preventDefault(); setProductDropdown(!productDropdown); }}>
                {t('nav.products')} <ChevronDown size={14} className={`chevron ${productDropdown ? 'rotated' : ''}`} />
              </Link>
              <ul className={`dropdown-menu dropdown-menu-wide ${productDropdown ? 'show' : ''}`}>
                <li><Link to="/san-pham" className="dropdown-item dropdown-item-all">{t('productsPage.all')}</Link></li>
                {productCategories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/san-pham#${cat.slug}`} className="dropdown-item">
                      {tCategory(cat.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className={`nav-item ${location.pathname.startsWith('/tin-tuc') ? 'active' : ''}`}>
              <Link to="/tin-tuc" className="nav-link">{t('nav.news')}</Link>
            </li>
            <li className={`nav-item ${isActive('/lien-he') ? 'active' : ''}`}>
              <Link to="/lien-he" className="nav-link">{t('nav.contact')}</Link>
            </li>
          </ul>

          {/* CTA */}
          <div className="nav-cta">
            <ThemeToggle />
            
            {/* Language Switcher */}
            <div className="lang-switcher" ref={langDropdownRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setLangDropdown(!langDropdown)}
                className="lang-trigger"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <span>{language === 'vi' ? '🇻🇳' : language === 'en' ? '🇬🇧' : '🇨🇳'}</span>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{language}</span>
                <ChevronDown size={12} />
              </button>
              
              {langDropdown && (
                <ul 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.5rem 0',
                    margin: '0.5rem 0 0 0',
                    listStyle: 'none',
                    zIndex: 1000,
                    minWidth: '120px'
                  }}
                >
                  <li>
                    <button 
                      onClick={() => { setLanguage('vi'); setLangDropdown(false); }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: language === 'vi' ? 'var(--primary)' : 'var(--text-primary)',
                        fontWeight: language === 'vi' ? '600' : 'normal'
                      }}
                    >
                      <span>🇻🇳</span> Tiếng Việt
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setLanguage('en'); setLangDropdown(false); }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: language === 'en' ? 'var(--primary)' : 'var(--text-primary)',
                        fontWeight: language === 'en' ? '600' : 'normal'
                      }}
                    >
                      <span>🇬🇧</span> English
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setLanguage('zh'); setLangDropdown(false); }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: language === 'zh' ? 'var(--primary)' : 'var(--text-primary)',
                        fontWeight: language === 'zh' ? '600' : 'normal'
                      }}
                    >
                      <span>🇨🇳</span> 中文
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <a href={`tel:${settings.hotline || '0703295692'}`} className="btn btn-primary btn-sm">
              <Phone size={16} />
              {t('nav.callNow')}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`}>{t('nav.home')}</Link>
          <div className="mobile-group">
            <span className="mobile-group-title">{t('nav.about')}</span>
            <Link to="/gioi-thieu/cong-ty" className="mobile-link sub">{t('nav.aboutCompany')}</Link>
            <Link to="/gioi-thieu/nha-may" className="mobile-link sub">{t('nav.factory')}</Link>
            <Link to="/gioi-thieu/chung-nhan" className="mobile-link sub">{t('nav.certs')}</Link>
            <Link to="/gioi-thieu/hinh-anh" className="mobile-link sub">{t('nav.gallery')}</Link>
          </div>
          <div className="mobile-group">
            <Link to="/san-pham" className="mobile-group-title" style={{ display: 'block', textDecoration: 'none' }}>{t('nav.products')}</Link>
            {productCategories.map(cat => (
              <Link key={cat.id} to={`/san-pham#${cat.slug}`} className="mobile-link sub">
                {tCategory(cat.name)}
              </Link>
            ))}
          </div>
          <Link to="/tin-tuc" className={`mobile-link ${location.pathname.startsWith('/tin-tuc') ? 'active' : ''}`}>{t('nav.news')}</Link>
          <Link to="/lien-he" className={`mobile-link ${isActive('/lien-he') ? 'active' : ''}`}>{t('nav.contact')}</Link>
          
          {/* Mobile Language selector */}
          <div className="mobile-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
            <span className="mobile-group-title">Language / Ngôn ngữ</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setLanguage('vi')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: language === 'vi' ? 'var(--green-50)' : 'var(--surface-card)',
                  color: language === 'vi' ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: language === 'vi' ? '600' : 'normal',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>🇻🇳</span> VI
              </button>
              <button 
                onClick={() => setLanguage('en')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: language === 'en' ? 'var(--green-50)' : 'var(--surface-card)',
                  color: language === 'en' ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: language === 'en' ? '600' : 'normal',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>🇬🇧</span> EN
              </button>
              <button 
                onClick={() => setLanguage('zh')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: language === 'zh' ? 'var(--green-50)' : 'var(--surface-card)',
                  color: language === 'zh' ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: language === 'zh' ? '600' : 'normal',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>🇨🇳</span> ZH
              </button>
            </div>
          </div>

          <div className="mobile-contact" style={{ marginTop: '1.5rem' }}>
            <a href={`tel:${settings.hotline || '0703295692'}`} className="btn btn-primary" style={{width:'100%'}}>
              <Phone size={16} /> {t('nav.callNow')}: {settings.hotline || '0703 295 692'}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
