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
                <div className="animate-fade-in-up" style={{ opacity: 0 }}>
                  <h3>Mô tả sản phẩm</h3>
                  <p>{product.description}</p>
                  {product.usage && (
                    <>
                      <h3 style={{ marginTop: '1.5rem' }}>Hướng dẫn sử dụng</h3>
                      <p>{product.usage}</p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'specs' && product.specs && (
                <div className="animate-fade-in-up" style={{ opacity: 0 }}>
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
                </div>
              )}

              {activeTab === 'packaging' && (
                <div className="animate-fade-in-up" style={{ opacity: 0 }}>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
