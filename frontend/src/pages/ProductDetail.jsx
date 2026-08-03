import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Leaf, Package, Beaker, Truck, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './ProductDetail.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { t, tProduct, tCategory, language } = useLanguage();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setCurrentSlide(0);
    fetch(`${API}/api/products/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [slug]);

  // Clean helper for auto-play
  const startAutoPlay = useCallback((totalImages) => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    if (totalImages > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalImages);
      }, 4500); // 4.5s
    }
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
  }, []);

  // Carousel auto-play lifecycle
  useEffect(() => {
    if (!product) return;
    const images = product.images && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [];
    
    startAutoPlay(images.length);
    return () => stopAutoPlay();
  }, [product, startAutoPlay, stopAutoPlay]);

  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;
  if (!product) return (
    <div className="section" style={{ textAlign: 'center', padding: '8rem 0' }}>
      <h2>{language === 'vi' ? 'Không tìm thấy sản phẩm' : language === 'en' ? 'Product not found' : '未找到该产品'}</h2>
      <Link to="/san-pham" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        {language === 'vi' ? 'Quay lại danh sách' : language === 'en' ? 'Back to list' : '返回列表'}
      </Link>
    </div>
  );

  const tabs = [
    { id: 'desc', label: language === 'vi' ? '1. Mô tả & Công dụng' : language === 'en' ? '1. Description & Uses' : '1. 产品描述与主要用途', icon: <Leaf size={16} /> },
    { id: 'specs', label: language === 'vi' ? '2. Thông số kỹ thuật & Tiêu chuẩn' : language === 'en' ? '2. Specifications & Standards' : '2. 规格指标与质量标准', icon: <Beaker size={16} /> },
    { id: 'packaging', label: language === 'vi' ? '3. HD sử dụng, Đóng gói & Vận chuyển' : language === 'en' ? '3. Packaging & Logistics' : '3. 包装、储存与物流运输', icon: <Truck size={16} /> },
  ];

  const specLabels = {
    protein: language === 'vi' ? 'Protein thô' : language === 'en' ? 'Crude Protein' : '粗蛋白质',
    moisture: language === 'vi' ? 'Độ ẩm' : language === 'en' ? 'Moisture' : '水分',
    fat: language === 'vi' ? 'Chất béo' : language === 'en' ? 'Crude Fat' : '粗脂肪',
    ash: language === 'vi' ? 'Tro' : language === 'en' ? 'Crude Ash' : '粗灰分',
    chitin: language === 'vi' ? 'Chitin' : language === 'en' ? 'Chitin' : '甲壳素',
    cadmium: language === 'vi' ? 'Cadmium (Cd)' : language === 'en' ? 'Cadmium (Cd)' : '镉 (Cd)',
    tvn: language === 'vi' ? 'TVN' : language === 'en' ? 'TVN' : '挥发性盐基氮 (TVN)',
    minerals: language === 'vi' ? 'Khoáng bổ sung' : language === 'en' ? 'Added Minerals' : '矿物质添加',
    dha_epa: language === 'vi' ? 'DHA + EPA' : language === 'en' ? 'DHA + EPA' : 'DHA + EPA',
    phospholipid: language === 'vi' ? 'Phospholipid' : language === 'en' ? 'Phospholipids' : '磷脂',
    salt: language === 'vi' ? 'Muối' : language === 'en' ? 'Salt (NaCl)' : '盐分 (NaCl)',
    sand: language === 'vi' ? 'Cát, sạn' : language === 'en' ? 'Sand & Silica' : '沙分',
    enzyme_activity: language === 'vi' ? 'Hoạt tính enzyme' : language === 'en' ? 'Enzyme Activity' : '酶活性',
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : [];

  return (
    <div className="product-detail-page">
      <div className="page-header" style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container">
          <h1 className="page-title">{tProduct(product, 'name')}</h1>
          <p className="page-desc">{tCategory(product.category)}</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="pd-grid">
            {/* Image Section */}
            <div className="pd-image-col animate-fade-in-left">
              {images.length === 0 ? (
                <div className="pd-image-box">
                  <div className="pd-image-placeholder">
                    <Leaf size={64} strokeWidth={1} />
                  </div>
                </div>
              ) : (
                <div className="pd-gallery-wrapper">
                  {/* Main Large Carousel */}
                  <div
                    className="pd-carousel"
                    onMouseEnter={stopAutoPlay}
                    onMouseLeave={() => startAutoPlay(images.length)}
                  >
                    <div className="pd-carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                      {images.map((img, i) => (
                        <div className="pd-carousel-slide" key={i}>
                          <img src={`${API}${img}`} alt={`${product.name} - ${i + 1}`} />
                        </div>
                      ))}
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="pd-carousel-btn pd-carousel-prev"
                          onClick={() => setCurrentSlide(prev => prev === 0 ? images.length - 1 : prev - 1)}
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          type="button"
                          className="pd-carousel-btn pd-carousel-next"
                          onClick={() => setCurrentSlide(prev => (prev + 1) % images.length)}
                          aria-label="Ảnh sau"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}

                    <div className="pd-carousel-counter">
                      {currentSlide + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip Below Main Image */}
                  {images.length > 1 && (
                    <div className="pd-thumbnails-strip">
                      {images.map((img, idx) => (
                        <button
                          type="button"
                          key={idx}
                          className={`pd-thumb-btn ${idx === currentSlide ? 'active' : ''}`}
                          onClick={() => setCurrentSlide(idx)}
                        >
                          <img src={`${API}${img}`} alt={`Thumbnail ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pd-info-col animate-fade-in-right">
              <span className="card-tag">{tCategory(product.category)}</span>
              <h1 className="pd-title">{tProduct(product, 'name')}</h1>
              <p className="pd-short-desc">{tProduct(product, 'shortDesc')}</p>

              {/* Quick specs */}
              {product.specs && (
                <div className="pd-quick-specs">
                  {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                    <div className="pd-quick-spec" key={key}>
                      <span className="pqs-label">{specLabels[key] || key}</span>
                      <span className="pqs-value">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pd-actions">
                <Link to="/lien-he" className="btn btn-primary btn-lg">
                  {language === 'vi' ? 'Liên hệ báo giá' : language === 'en' ? 'Get a Quote' : '联系报价'}
                </Link>
                <Link to="/san-pham" className="btn btn-outline">
                  <ArrowLeft size={16} /> {t('productsPage.all')}
                </Link>
              </div>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="pd-tabs-section">
            <div className="pd-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`pd-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">
              {activeTab === 'desc' && (
                <div className="animate-fade-in-up">
                  {/* Giới thiệu sản phẩm */}
                  <div className="desc-section">
                    <h3>{language === 'vi' ? 'Giới thiệu sản phẩm' : language === 'en' ? 'Product Overview' : '产品介绍'}</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{tProduct(product, 'description')}</p>
                  </div>

                  {/* Ưu điểm nổi bật */}
                  {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                    <div className="desc-section" style={{ marginTop: '2rem' }}>
                      <h3>{language === 'vi' ? 'Ưu điểm nổi bật' : language === 'en' ? 'Key Highlights' : '核心优势'}</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {tProduct(product, 'highlights').map((h, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Công dụng */}
                  {Array.isArray(product.uses) && product.uses.length > 0 && (
                    <div className="desc-section" style={{ marginTop: '2rem' }}>
                      <h3>{language === 'vi' ? 'Công dụng' : language === 'en' ? 'Product Application' : '主要功效'}</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {tProduct(product, 'uses').map((u, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Đối tượng sử dụng */}
                  {Array.isArray(product.targets) && product.targets.length > 0 && (
                    <div className="desc-section" style={{ marginTop: '2rem' }}>
                      <h3>{language === 'vi' ? 'Đối tượng sử dụng' : language === 'en' ? 'Target Species' : '适用对象'}</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {tProduct(product, 'targets').map((t_spec, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                            <span>{t_spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="animate-fade-in-up">
                  {/* Thành phần */}
                  {product.ingredients && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>{language === 'vi' ? 'Thành phần' : language === 'en' ? 'Ingredients' : '产品成分'}</h3>
                      <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{tProduct(product, 'ingredients')}</p>
                    </div>
                  )}

                  {/* Chỉ tiêu cảm quan */}
                  {Array.isArray(product.sensorySpecs) && product.sensorySpecs.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>{language === 'vi' ? 'Chỉ tiêu cảm quan' : language === 'en' ? 'Sensory Specifications' : '感官指标'}</h3>
                      <table className="specs-table">
                        <thead>
                          <tr>
                            <th>{language === 'vi' ? 'Chỉ tiêu' : language === 'en' ? 'Indicator' : '检验指标'}</th>
                            <th>{language === 'vi' ? 'Yêu cầu' : language === 'en' ? 'Requirement' : '规格要求'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tProduct(product, 'sensorySpecs').map((spec, i) => (
                            <tr key={i}>
                              <td>{spec.indicator}</td>
                              <td><strong>{spec.requirement}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Chỉ tiêu chất lượng */}
                  {Array.isArray(product.qualitySpecs) && product.qualitySpecs.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>{language === 'vi' ? 'Chỉ tiêu chất lượng' : language === 'en' ? 'Quality Specifications' : '质量规格指标'}</h3>
                      <table className="specs-table">
                        <thead>
                          <tr>
                            <th>{language === 'vi' ? 'Chỉ tiêu' : language === 'en' ? 'Indicator' : '分析指标'}</th>
                            <th>{language === 'vi' ? 'Đơn vị' : language === 'en' ? 'Unit' : '单位'}</th>
                            <th>{language === 'vi' ? 'Giá trị' : language === 'en' ? 'Value' : '标准要求'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tProduct(product, 'qualitySpecs').map((spec, i) => (
                            <tr key={i}>
                              <td>{spec.indicator}</td>
                              <td>{spec.unit}</td>
                              <td><strong>{spec.value}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'packaging' && (
                <div className="animate-fade-in-up">
                  {/* Rich details cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="packaging-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                      {product.packaging && (
                        <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                          <Package size={28} />
                          <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>
                            {language === 'vi' ? 'Bao bì đóng gói' : language === 'en' ? 'Packaging Spec' : '包装规格'}
                          </h4>
                          <p style={{ margin: 0 }}>{tProduct(product, 'packaging')}</p>
                        </div>
                      )}
                      {product.weight && (
                        <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                          <Package size={28} style={{ color: 'var(--secondary)' }} />
                          <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>
                            {language === 'vi' ? 'Trọng lượng đóng bao' : language === 'en' ? 'Bag Weight' : '包装净重'}
                          </h4>
                          <p style={{ margin: 0 }}>{tProduct(product, 'weight')}</p>
                        </div>
                      )}
                      {product.storage && (
                        <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                          <Truck size={28} />
                          <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>
                            {language === 'vi' ? 'Điều kiện bảo quản' : language === 'en' ? 'Storage Conditions' : '储存条件'}
                          </h4>
                          <p style={{ margin: 0 }}>{tProduct(product, 'storage')}</p>
                        </div>
                      )}
                      {product.shelfLife && (
                        <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                          <Truck size={28} style={{ color: 'var(--secondary)' }} />
                          <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>
                            {language === 'vi' ? 'Hạn sử dụng' : language === 'en' ? 'Shelf Life' : '保质期限'}
                          </h4>
                          <p style={{ margin: 0 }}>{tProduct(product, 'shelfLife')}</p>
                        </div>
                      )}
                    </div>

                    {product.shippingStandard && (
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                          {language === 'vi' ? 'Tiêu chuẩn vận chuyển' : language === 'en' ? 'Transportation Standard' : '物流运输标准'}
                        </h3>
                        <p style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                          {tProduct(product, 'shippingStandard')}
                        </p>
                      </div>
                    )}

                    {product.qualityCommitment && (
                      <div style={{ padding: '1.5rem', background: 'rgba(30,125,82,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-200)' }}>
                        <h3 style={{ color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                          <span>★</span> {language === 'vi' ? 'Cam kết chất lượng từ Đồng Tâm' : language === 'en' ? 'Quality Commitment from Dong Tam' : '同心饲料质量承诺'}
                        </h3>
                        <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                          {tProduct(product, 'qualityCommitment')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
