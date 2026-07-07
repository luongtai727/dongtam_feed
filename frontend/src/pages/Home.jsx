import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, Shield, Award, Factory, TrendingUp, Users,
  ChevronRight, Star, Zap, Phone, CheckCircle2
} from 'lucide-react';
import './Home.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/products/featured`).then(r => r.json()).then(setProducts).catch(() => {});
    fetch(`${API}/api/news`).then(r => r.json()).then(d => setNews(d.slice(0, 3))).catch(() => {});
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
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
              Đồng Tâm Feed Solutions chuyên cung cấp nguyên liệu thức ăn chăn nuôi và thủy sản
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
                <div className="about-image-placeholder">
                  <Factory size={64} strokeWidth={1} />
                  <span>Nhà máy Đồng Tâm Feed</span>
                </div>
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
            <a href={`tel:${settings.hotline || '0901234567'}`} className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              <Phone size={18} /> {settings.hotline || '0901 234 567'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
