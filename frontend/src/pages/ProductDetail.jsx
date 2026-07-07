import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Leaf, Package, Beaker, Truck, ArrowLeft } from 'lucide-react';
import './ProductDetail.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/products/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;
  if (!product) return (
    <div className="section" style={{ textAlign: 'center', padding: '8rem 0' }}>
      <h2>Không tìm thấy sản phẩm</h2>
      <Link to="/san-pham" className="btn btn-primary" style={{ marginTop: '1rem' }}>Quay lại danh sách</Link>
    </div>
  );

  const tabs = [
    { id: 'desc', label: 'Mô tả & Công dụng', icon: <Leaf size={16} /> },
    { id: 'specs', label: 'Thông số kỹ thuật', icon: <Beaker size={16} /> },
    { id: 'packaging', label: 'Quy cách & Vận chuyển', icon: <Truck size={16} /> },
  ];

  const specLabels = {
    protein: 'Protein thô',
    moisture: 'Độ ẩm',
    fat: 'Chất béo',
    ash: 'Tro',
    chitin: 'Chitin',
    cadmium: 'Cadmium (Cd)',
    tvn: 'TVN',
    minerals: 'Khoáng bổ sung',
    dha_epa: 'DHA + EPA',
    phospholipid: 'Phospholipid',
    salt: 'Muối',
    sand: 'Cát, sạn',
    enzyme_activity: 'Hoạt tính enzyme',
  };

  return (
    <div className="product-detail-page">
      <div className="page-header" style={{ padding: '5rem 0 2.5rem' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/san-pham">Sản phẩm</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="pd-grid">
            {/* Image */}
            <div className="pd-image-col animate-fade-in-left">
              <div className="pd-image-box">
                {product.image ? (
                  <img src={`${API}${product.image}`} alt={product.name} />
                ) : (
                  <div className="pd-image-placeholder">
                    <Leaf size={64} strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="pd-info-col animate-fade-in-right">
              <span className="card-tag">{product.category}</span>
              <h1 className="pd-title">{product.name}</h1>
              <p className="pd-short-desc">{product.shortDesc}</p>

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
                <Link to="/lien-he" className="btn btn-primary btn-lg">Liên hệ báo giá</Link>
                <Link to="/san-pham" className="btn btn-outline">
                  <ArrowLeft size={16} /> Tất cả sản phẩm
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
                    <h3>Giới thiệu sản phẩm</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                  </div>

                  {/* Ưu điểm nổi bật */}
                  {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                    <div className="desc-section" style={{ marginTop: '2rem' }}>
                      <h3>Ưu điểm nổi bật</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {product.highlights.map((h, i) => (
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
                      <h3>Công dụng</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {product.uses.map((u, i) => (
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
                      <h3>Đối tượng sử dụng</h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {product.targets.map((t, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback to old usage description */}
                  {(!product.highlights || product.highlights.length === 0) && product.usage && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3>Hướng dẫn sử dụng</h3>
                      <p>{product.usage}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="animate-fade-in-up">
                  {/* Thành phần */}
                  {product.ingredients && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>Thành phần</h3>
                      <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{product.ingredients}</p>
                    </div>
                  )}

                  {/* Chỉ tiêu cảm quan */}
                  {Array.isArray(product.sensorySpecs) && product.sensorySpecs.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>Chỉ tiêu cảm quan</h3>
                      <table className="specs-table">
                        <thead>
                          <tr>
                            <th>Chỉ tiêu</th>
                            <th>Yêu cầu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.sensorySpecs.map((spec, i) => (
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
                      <h3>Chỉ tiêu chất lượng</h3>
                      <table className="specs-table">
                        <thead>
                          <tr>
                            <th>Chỉ tiêu</th>
                            <th>Đơn vị</th>
                            <th>Giá trị</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.qualitySpecs.map((spec, i) => (
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

                  {/* Hướng dẫn sử dụng */}
                  {product.usage && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>Hướng dẫn sử dụng</h3>
                      <p style={{ whiteSpace: 'pre-line' }}>{product.usage}</p>
                    </div>
                  )}

                  {/* Lưu ý */}
                  {product.usageNote && (
                    <div style={{ padding: '1.25rem', background: 'var(--surface-muted)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', marginTop: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-heading)', fontWeight: '600' }}>Lưu ý khi sử dụng</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.usageNote}</p>
                    </div>
                  )}

                  {/* Fallback to old specifications table if sensory/quality are empty */}
                  {(!product.sensorySpecs || product.sensorySpecs.length === 0) && (!product.qualitySpecs || product.qualitySpecs.length === 0) && product.specs && (
                    <>
                      <h3>Bảng thông số kỹ thuật</h3>
                      <table className="specs-table">
                        <thead>
                          <tr><th>Chỉ tiêu</th><th>Giá trị</th></tr>
                        </thead>
                        <tbody>
                          {Object.entries(product.specs).map(([key, val]) => (
                            <tr key={key}>
                              <td>{specLabels[key] || key}</td>
                              <td><strong>{val}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'packaging' && (
                <div className="animate-fade-in-up">
                  {/* Rich details cards */}
                  {(product.weight || product.shelfLife || product.shippingStandard || product.qualityCommitment) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div className="packaging-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {product.packaging && (
                          <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                            <Package size={28} />
                            <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Bao bì đóng gói</h4>
                            <p style={{ margin: 0 }}>{product.packaging}</p>
                          </div>
                        )}
                        {product.weight && (
                          <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                            <Package size={28} style={{ color: 'var(--secondary)' }} />
                            <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Trọng lượng đóng bao</h4>
                            <p style={{ margin: 0 }}>{product.weight}</p>
                          </div>
                        )}
                        {product.storage && (
                          <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                            <Truck size={28} />
                            <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Điều kiện bảo quản</h4>
                            <p style={{ margin: 0 }}>{product.storage}</p>
                          </div>
                        )}
                        {product.shelfLife && (
                          <div className="pkg-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                            <Truck size={28} style={{ color: 'var(--secondary)' }} />
                            <h4 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Hạn sử dụng</h4>
                            <p style={{ margin: 0 }}>{product.shelfLife}</p>
                          </div>
                        )}
                      </div>

                      {product.shippingStandard && (
                        <div>
                          <h3 style={{ marginBottom: '0.5rem' }}>Tiêu chuẩn vận chuyển</h3>
                          <p style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{product.shippingStandard}</p>
                        </div>
                      )}

                      {product.qualityCommitment && (
                        <div style={{ padding: '1.5rem', background: 'rgba(30,125,82,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-200)' }}>
                          <h3 style={{ color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                            <span>★</span> Cam kết chất lượng từ Đồng Tâm
                          </h3>
                          <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{product.qualityCommitment}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback to old view */
                    <div className="packaging-grid">
                      <div className="pkg-card">
                        <Package size={32} />
                        <h4>Quy cách đóng gói</h4>
                        <p>{product.packaging || 'Liên hệ để biết thêm chi tiết'}</p>
                      </div>
                      <div className="pkg-card">
                        <Truck size={32} />
                        <h4>Bảo quản & Vận chuyển</h4>
                        <p>{product.storage || 'Liên hệ để biết thêm chi tiết'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
