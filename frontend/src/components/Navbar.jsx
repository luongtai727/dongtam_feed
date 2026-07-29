import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, MapPin, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const location = useLocation();
  const aboutDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

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
              <Link to="/" className="nav-link">Trang chủ</Link>
            </li>
            <li
              className={`nav-item has-dropdown ${location.pathname.startsWith('/gioi-thieu') ? 'active' : ''}`}
              ref={aboutDropdownRef}
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <span className="nav-link" onClick={() => setAboutDropdown(!aboutDropdown)}>
                Giới thiệu <ChevronDown size={14} className={`chevron ${aboutDropdown ? 'rotated' : ''}`} />
              </span>
              <ul className={`dropdown-menu ${aboutDropdown ? 'show' : ''}`}>
                <li><Link to="/gioi-thieu/cong-ty" className="dropdown-item">Về công ty</Link></li>
                <li><Link to="/gioi-thieu/nha-may" className="dropdown-item">Nhà máy</Link></li>
                <li><Link to="/gioi-thieu/chung-nhan" className="dropdown-item">Chứng nhận</Link></li>
                <li><Link to="/gioi-thieu/hinh-anh" className="dropdown-item">Thư viện ảnh</Link></li>
              </ul>
            </li>
            <li
              className={`nav-item has-dropdown ${location.pathname.startsWith('/san-pham') ? 'active' : ''}`}
              ref={productDropdownRef}
              onMouseEnter={() => setProductDropdown(true)}
              onMouseLeave={() => setProductDropdown(false)}
            >
              <Link to="/san-pham" className="nav-link" onClick={(e) => { if (productDropdown) e.preventDefault(); setProductDropdown(!productDropdown); }}>
                Sản phẩm <ChevronDown size={14} className={`chevron ${productDropdown ? 'rotated' : ''}`} />
              </Link>
              <ul className={`dropdown-menu dropdown-menu-wide ${productDropdown ? 'show' : ''}`}>
                <li><Link to="/san-pham" className="dropdown-item dropdown-item-all">Tất cả sản phẩm</Link></li>
                {productCategories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/san-pham#${cat.slug}`} className="dropdown-item">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className={`nav-item ${location.pathname.startsWith('/tin-tuc') ? 'active' : ''}`}>
              <Link to="/tin-tuc" className="nav-link">Tin tức</Link>
            </li>
            <li className={`nav-item ${isActive('/lien-he') ? 'active' : ''}`}>
              <Link to="/lien-he" className="nav-link">Liên hệ</Link>
            </li>
          </ul>

          {/* CTA */}
          <div className="nav-cta">
            <ThemeToggle />
            <a href={`tel:${settings.hotline || '0703295692'}`} className="btn btn-primary btn-sm">
              <Phone size={16} />
              Liên hệ ngay
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`}>Trang chủ</Link>
          <div className="mobile-group">
            <span className="mobile-group-title">Giới thiệu</span>
            <Link to="/gioi-thieu/cong-ty" className="mobile-link sub">Về công ty</Link>
            <Link to="/gioi-thieu/nha-may" className="mobile-link sub">Nhà máy</Link>
            <Link to="/gioi-thieu/chung-nhan" className="mobile-link sub">Chứng nhận</Link>
            <Link to="/gioi-thieu/hinh-anh" className="mobile-link sub">Thư viện ảnh</Link>
          </div>
          <div className="mobile-group">
            <Link to="/san-pham" className="mobile-group-title" style={{ display: 'block', textDecoration: 'none' }}>Sản phẩm</Link>
            {productCategories.map(cat => (
              <Link key={cat.id} to={`/san-pham#${cat.slug}`} className="mobile-link sub">
                {cat.name}
              </Link>
            ))}
          </div>
          <Link to="/tin-tuc" className={`mobile-link ${location.pathname.startsWith('/tin-tuc') ? 'active' : ''}`}>Tin tức</Link>
          <Link to="/lien-he" className={`mobile-link ${isActive('/lien-he') ? 'active' : ''}`}>Liên hệ</Link>
          <div className="mobile-contact">
            <a href={`tel:${settings.hotline || '0703295692'}`} className="btn btn-primary" style={{width:'100%'}}>
              <Phone size={16} /> Gọi ngay: {settings.hotline || '0703 295 692'}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
