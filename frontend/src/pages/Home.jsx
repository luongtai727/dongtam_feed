import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, Shield, Award, Factory, TrendingUp, Users,
  ChevronRight, Star, Zap, Phone, CheckCircle2, X
} from 'lucide-react';
import './Home.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
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

  const stats = [
    { icon: <Factory size={28} />, number: '5,000m²', label: 'Diện tích nhà máy' },
    { icon: <TrendingUp size={28} />, number: '50 tấn', label: 'Công suất/ngày' },
    { icon: <Users size={28} />, number: '200+', label: 'Đối tác tin cậy' },
    { icon: <Award size={28} />, number: '10+', label: 'Năm kinh nghiệm' },
  ];

  const strengths = [
    { icon: <Leaf size={24} />, title: 'Nguyên liệu tự nhiên', desc: 'Nguồn nguyên liệu 100% từ phụ phẩm thủy sản Việt Nam, đảm bảo chất lượng và truy xuất nguồn gốc.' },
    { icon: <Shield size={24} />, title: 'Tiêu chuẩn quốc tế', desc: 'Sản phẩm đạt các tiêu chuẩn ISO 9001, ISO 22000, GMP và HACCP nghiêm ngặt.' },
    { icon: <Zap size={24} />, title: 'Công nghệ hiện đại', desc: 'Dây chuyền sản xuất tự động, hệ thống sấy công nghiệp, phòng kiểm nghiệm đạt chuẩn ISO 17025.' },
    { icon: <Star size={24} />, title: 'Giá cạnh tranh', desc: 'Chi phí thấp hơn 20-30% so với nguyên liệu nhập khẩu, chất lượng tương đương hoặc vượt trội.' },
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
              <span>Giải pháp dinh dưỡng bền vững</span>
            </div>
            <h1 className="hero-title">
              Nguyên liệu thức ăn <br />
              <span className="hero-highlight">chăn nuôi chất lượng cao</span>
            </h1>
            <p className="hero-desc">
              Giải Pháp Dinh Dưỡng Đồng Tâm chuyên cung cấp nguyên liệu thức ăn chăn nuôi và thủy sản
              từ phụ phẩm thủy sản tự nhiên. Đối tác tin cậy của hàng trăm doanh nghiệp trên cả nước.
            </p>
            <div className="hero-actions">
              <Link to="/san-pham" className="btn btn-primary btn-lg">
                Xem sản phẩm <ArrowRight size={18} />
              </Link>
              <Link to="/lien-he" className="btn btn-white btn-lg">
                <Phone size={18} /> Liên hệ tư vấn
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <CheckCircle2 size={16} />
                <span>ISO 9001:2015</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle2 size={16} />
                <span>HACCP</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle2 size={16} />
                <span>GMP</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fade-in-right">
            <div className="hero-card-stack">
              <div className="hero-card hero-card-1">
                <div className="hero-card-icon"><Leaf size={32} /></div>
                <h3>100% Tự nhiên</h3>
                <p>Từ phụ phẩm thủy sản</p>
              </div>
              <div className="hero-card hero-card-2">
                <div className="hero-card-icon"><Shield size={32} /></div>
                <h3>An toàn</h3>
                <p>Đạt chuẩn quốc tế</p>
              </div>
              <div className="hero-card hero-card-3">
                <div className="hero-card-icon"><Award size={32} /></div>
                <h3>Uy tín</h3>
                <p>10+ năm kinh nghiệm</p>
              </div>
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
                    <span>Nhà máy Đồng Tâm Feed</span>
                  </div>
                )}
              </div>
              <div className="about-image-accent"></div>
            </div>
            <div className="about-content animate-fade-in-right">
              <span className="section-label">VỀ CHÚNG TÔI</span>
              <h2 className="about-title">Giải pháp dinh dưỡng <span className="text-green">bền vững</span> cho ngành chăn nuôi</h2>
              <p className="about-text">
                {settings.aboutCompany || 'Công ty TNHH Giải pháp Dinh dưỡng Đồng Tâm được thành lập năm 2015, chuyên nghiên cứu, sản xuất và cung cấp các nguyên liệu thức ăn chăn nuôi chất lượng cao từ phụ phẩm thủy sản.'}
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
                Tìm hiểu thêm <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS ==================== */}
      <section className="section products-section">
        <div className="container">
          <span className="section-label center">SẢN PHẨM NỔI BẬT</span>
          <h2 className="section-title">Nguyên liệu chất lượng cao</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Các dòng sản phẩm chủ lực được nghiên cứu và sản xuất theo tiêu chuẩn quốc tế
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
                    <img src={`${API}${product.image}`} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">
                      <Leaf size={40} strokeWidth={1} />
                    </div>
                  )}
                  <div className="product-overlay">
                    <span>Xem chi tiết</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="card-tag">{product.category}</span>
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-text">{product.shortDesc}</p>
                  <div className="product-link">
                    Tìm hiểu thêm <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/san-pham" className="btn btn-primary btn-lg">
              Xem tất cả sản phẩm <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STRENGTHS ==================== */}
      <section className="section strengths-section">
        <div className="container">
          <span className="section-label center">TẠI SAO CHỌN CHÚNG TÔI</span>
          <h2 className="section-title">Thế mạnh vượt trội</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Cam kết mang đến những giải pháp dinh dưỡng tốt nhất cho ngành chăn nuôi Việt Nam
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
            <span className="section-label center">TIN TỨC</span>
            <h2 className="section-title">Tin tức & Sự kiện</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Cập nhật tin tức mới nhất về công ty và ngành chăn nuôi
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
                      <img src={`${API}${article.image}`} alt={article.title} />
                    ) : (
                      <div className="news-placeholder">
                        <Leaf size={32} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="news-content">
                    <span className="badge badge-green">{article.category}</span>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <div className="news-meta">
                      <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="news-readmore">Đọc tiếp <ArrowRight size={12} /></span>
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
            <span className="section-label center">HÌNH ẢNH HOẠT ĐỘNG</span>
            <h2 className="section-title">Thư viện ảnh</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Hình ảnh thực tế về cơ sở vật chất, nhà máy sản xuất và hoạt động của Đồng Tâm Feed
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
                Xem thêm hình ảnh <ArrowRight size={16} />
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
                  <X size={24} /> Đóng
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
            <h2>Bạn cần tư vấn về nguyên liệu thức ăn chăn nuôi?</h2>
            <p>Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để được tư vấn miễn phí và nhận báo giá tốt nhất.</p>
          </div>
          <div className="cta-actions">
            <Link to="/lien-he" className="btn btn-white btn-lg">
              Gửi yêu cầu báo giá
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
