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
  const [settings, setSettings] = useState({});
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAboutDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAboutDropdown(false);
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
              <span>Hotline: {settings.hotline || '0901 234 567'}</span>
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
          <Link to="/" className="navbar-brand">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
                <path d="M12 28V16L20 10L28 16V28H22V22H18V28H12Z" fill="white" fillOpacity="0.9"/>
                <path d="M17 18H23V20H17V18Z" fill="rgba(5,150,105,0.5)"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#059669"/>
                    <stop offset="1" stopColor="#102a43"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">ĐỒNG TÂM</span>
              <span className="brand-sub">FEED SOLUTIONS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-menu">
            <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <Link to="/" className="nav-link">Trang chủ</Link>
            </li>
            <li
              className={`nav-item has-dropdown ${location.pathname.startsWith('/gioi-thieu') ? 'active' : ''}`}
              ref={dropdownRef}
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
              </ul>
            </li>
            <li className={`nav-item ${location.pathname.startsWith('/san-pham') ? 'active' : ''}`}>
              <Link to="/san-pham" className="nav-link">Sản phẩm</Link>
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
            <a href={`tel:${settings.hotline || '0901234567'}`} className="btn btn-primary btn-sm">
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
          </div>
          <Link to="/san-pham" className={`mobile-link ${location.pathname.startsWith('/san-pham') ? 'active' : ''}`}>Sản phẩm</Link>
          <Link to="/tin-tuc" className={`mobile-link ${location.pathname.startsWith('/tin-tuc') ? 'active' : ''}`}>Tin tức</Link>
          <Link to="/lien-he" className={`mobile-link ${isActive('/lien-he') ? 'active' : ''}`}>Liên hệ</Link>
          <div className="mobile-contact">
            <a href={`tel:${settings.hotline || '0901234567'}`} className="btn btn-primary" style={{width:'100%'}}>
              <Phone size={16} /> Gọi ngay: {settings.hotline || '0901 234 567'}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
