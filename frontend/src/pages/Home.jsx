import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, Shield, Award, Factory, TrendingUp, Users,
  ChevronRight, Star, Zap, Phone, CheckCircle2, X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Home() {
  const { language, t, tProduct, tNews, tCategory } = useLanguage();
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState({});
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/products/featured`).then(r => r.json()).then(setProducts).catch(() => {});
    fetch(`${API}/api/news`).then(r => r.json()).then(d => setNews(d.slice(0, 3))).catch(() => {});
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
    fetch(`${API}/api/gallery`).then(r => r.json()).then(setGallery).catch(() => {});
  }, []);

  const icons = [<Factory size={28} />, <TrendingUp size={28} />, <Users size={28} />, <Award size={28} />];
  const defaultStats = [
    { number: '5,000m²', label: 'Diện tích nhà máy', labelEn: 'Factory Area', labelZh: '工厂面积' },
    { number: '50 tấn', label: 'Công suất/ngày', labelEn: 'Capacity/Day', labelZh: '日产能' },
    { number: '200+', label: 'Đối tác tin cậy', labelEn: 'Trusted Partners', labelZh: '合作伙伴' },
    { number: '10+', label: 'Năm kinh nghiệm', labelEn: 'Years of Experience', labelZh: '年行业经验' },
  ];
  const statsData = (settings.stats && settings.stats.length > 0) ? settings.stats : defaultStats;
  const stats = statsData.map((s, i) => ({
    icon: icons[i] || icons[0],
    number: s.number,
    label: language === 'en' ? (s.labelEn || s.label) : language === 'zh' ? (s.labelZh || s.label) : s.label,
  }));

  const heroCerts = (settings.heroCertifications && settings.heroCertifications.length > 0)
    ? settings.heroCertifications
    : ['ISO 9001:2015', 'HACCP', 'GMP'];

  const strengths = [
    { icon: <Leaf size={24} />, title: t('strengths.item1Title'), desc: t('strengths.item1Desc') },
    { icon: <Shield size={24} />, title: t('strengths.item2Title'), desc: t('strengths.item2Desc') },
    { icon: <Zap size={24} />, title: t('strengths.item3Title'), desc: t('strengths.item3Desc') },
    { icon: <Star size={24} />, title: t('strengths.item4Title'), desc: t('strengths.item4Desc') },
  ];

  return (
    <div className="home-page">
      {/* ==================== HERO ==================== */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
        <div className="container hero-inner">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <Leaf size={14} />
              <span>{t('hero.badge')}</span>
            </div>
            <h1 className="hero-title">
              {t('hero.titleMain')} <br />
              <span className="hero-highlight">{t('hero.titleSub')}</span>
            </h1>
            <p className="hero-desc">
              {t('hero.desc')}
            </p>
            <div className="hero-actions">
              <Link to="/san-pham" className="btn btn-primary btn-lg">
                {t('hero.viewProducts')} <ArrowRight size={18} />
              </Link>
              <Link to="/lien-he" className="btn btn-white btn-lg">
                <Phone size={18} /> {t('hero.contactConsult')}
              </Link>
            </div>
            <div className="hero-trust">
              {heroCerts.map((cert, i) => (
                <div className="hero-trust-item" key={i}>
                  <CheckCircle2 size={16} />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual animate-fade-in-right">
            <div className="hero-card-stack">
              {(() => {
                const cardIcons = [<Leaf size={32} />, <Shield size={32} />, <Award size={32} />];
                const defaultCards = [
                  { title: '100% Tự nhiên', titleEn: '100% Natural', titleZh: '100% 天然', desc: 'Từ phụ phẩm thủy sản', descEn: 'From marine by-products', descZh: '源自海洋副产物' },
                  { title: 'An toàn', titleEn: 'Safe & Pure', titleZh: '安全无害', desc: 'Đạt chuẩn quốc tế', descEn: 'International standards', descZh: '符合国际标准' },
                  { title: 'Uy tín', titleEn: 'Reputable', titleZh: '诚信经营', desc: '10+ năm kinh nghiệm', descEn: '10+ years experience', descZh: '10年行业经验' },
                ];
                const cards = (settings.heroCards && settings.heroCards.length > 0) ? settings.heroCards : defaultCards;
                return cards.map((c, i) => (
                  <div className={`hero-card hero-card-${i + 1}`} key={i}>
                    <div className="hero-card-icon">{cardIcons[i] || cardIcons[0]}</div>
                    <h3>{language === 'en' ? (c.titleEn || c.title) : language === 'zh' ? (c.titleZh || c.title) : c.title}</h3>
                    <p>{language === 'en' ? (c.descEn || c.desc) : language === 'zh' ? (c.descZh || c.desc) : c.desc}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className="stat-card animate-fade-in-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT PREVIEW ==================== */}
      <section className="section about-preview">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper animate-fade-in-left">
              <div className="about-image-card">
                {settings.homeAboutImage ? (
                  <img 
                    src={`${API}${settings.homeAboutImage}`} 
                    alt="Về Đồng Tâm Feed" 
                    style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} 
                  />
                ) : (
                  <div className="about-image-placeholder">
                    <Factory size={64} strokeWidth={1} />
                    <span>{language === 'vi' ? 'Nhà máy Đồng Tâm Feed' : language === 'en' ? 'Dong Tam Feed Factory' : '同心饲料厂区'}</span>
                  </div>
                )}
              </div>
              <div className="about-image-accent"></div>
            </div>
            <div className="about-content animate-fade-in-right">
              <span className="section-label">{t('aboutPreview.sectionLabel')}</span>
              <h2 className="about-title">{t('aboutPreview.title')}</h2>
              <p className="about-text">
                {language === 'vi' ? (settings.aboutCompany || t('aboutPreview.desc')) : t('aboutPreview.desc')}
              </p>
              <div className="about-features">
                {strengths.slice(0, 3).map((s, i) => (
                  <div className="about-feature" key={i}>
                    <div className="about-feature-icon">{s.icon}</div>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/gioi-thieu/cong-ty" className="btn btn-outline">
                {t('aboutPreview.viewMore')} <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS ==================== */}
      <section className="section products-section">
        <div className="container">
          <span className="section-label center">{t('featuredProducts.sectionLabel')}</span>
          <h2 className="section-title">{t('featuredProducts.title')}</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            {t('featuredProducts.desc')}
          </p>

          <div className="products-grid">
            {products.map((product, i) => (
              <Link
                to={`/san-pham/${product.slug}`}
                className="product-card animate-fade-in-up"
                key={product.id}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="product-image">
                  {product.image ? (
                    <img src={`${API}${product.image}`} alt={tProduct(product, 'name')} />
                  ) : (
                    <div className="product-placeholder">
                      <Leaf size={40} strokeWidth={1} />
                    </div>
                  )}
                  <div className="product-overlay">
                    <span>{t('featuredProducts.viewDetail')}</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="card-tag">{tCategory(product.category)}</span>
                  <h3 className="card-title">{tProduct(product, 'name')}</h3>
                  <p className="card-text">{tProduct(product, 'shortDesc')}</p>
                  <div className="product-link">
                    {t('aboutPreview.viewMore')} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/san-pham" className="btn btn-primary btn-lg">
              {t('featuredProducts.viewAll')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STRENGTHS ==================== */}
      <section className="section strengths-section">
        <div className="container">
          <span className="section-label center">{t('strengths.sectionLabel')}</span>
          <h2 className="section-title">{t('strengths.title')}</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            {t('strengths.desc')}
          </p>

          <div className="strengths-grid">
            {strengths.map((s, i) => (
              <div className="strength-card animate-fade-in-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="strength-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEWS ==================== */}
      {news.length > 0 && (
        <section className="section news-section">
          <div className="container">
            <span className="section-label center">{t('newsSection.sectionLabel')}</span>
            <h2 className="section-title">{t('newsSection.title')}</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              {t('newsSection.desc')}
            </p>

            <div className="news-grid">
              {news.map((article, i) => (
                <Link
                  to={`/tin-tuc/${article.slug}`}
                  className="news-card animate-fade-in-up"
                  key={article.id}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="news-image">
                    {article.image ? (
                      <img src={`${API}${article.image}`} alt={tNews(article, 'title')} />
                    ) : (
                      <div className="news-placeholder">
                        <Leaf size={32} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="news-content">
                    <span className="badge badge-green">{language === 'vi' ? article.category : language === 'en' ? 'News' : '新闻'}</span>
                    <h3>{tNews(article, 'title')}</h3>
                    <p>{tNews(article, 'summary')}</p>
                    <div className="news-meta">
                      <span>{new Date(article.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'zh-CN')}</span>
                      <span className="news-readmore">{t('newsSection.readMore')} <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== GALLERY ==================== */}
      {gallery.length > 0 && (
        <section className="section gallery-section" style={{ background: 'var(--surface-muted)' }}>
          <div className="container">
            <span className="section-label center">{t('aboutPage.galleryTitle')}</span>
            <h2 className="section-title">{t('nav.gallery')}</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              {t('aboutPage.galleryDesc')}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {gallery.slice(0, 4).map(img => (
                <div 
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--surface-card)',
                    height: '240px'
                  }}
                  className="about-gallery-card"
                >
                  <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} className="about-gallery-img-wrapper">
                    <img 
                      src={`${API}${img.image}`} 
                      alt={img.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/gioi-thieu/hinh-anh" className="btn btn-outline">
                {language === 'vi' ? 'Xem thêm hình ảnh' : language === 'en' ? 'View more images' : '查看更多照片'} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Lightbox Modal */}
          {selectedImage && (
            <div 
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '2rem',
                cursor: 'zoom-out'
              }}
            >
              <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '80%' }} onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '0',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <X size={24} /> {language === 'vi' ? 'Đóng' : language === 'en' ? 'Close' : '关闭'}
                </button>
                <img 
                  src={`${API}${selectedImage.image}`} 
                  alt={selectedImage.title} 
                  style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} 
                />
                <h3 style={{ color: '#fff', textAlign: 'center', marginTop: '1rem', fontWeight: '500', fontSize: '1.1rem' }}>
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.desc')}</p>
          </div>
          <div className="cta-actions">
            <Link to="/lien-he" className="btn btn-white btn-lg">
              {t('cta.getQuote')}
            </Link>
            <a href={`tel:${settings.hotline || '0703295692'}`} className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              <Phone size={18} /> {settings.hotline || '0703 295 692'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
