import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Factory, Award, Eye, Target, Heart, Shield, CheckCircle2, ChevronRight, Image, X } from 'lucide-react';
import './About.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function About() {
  const { section } = useParams();
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('cong-ty');
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (section) setActiveTab(section);
  }, [section]);

  useEffect(() => {
    if (activeTab === 'hinh-anh') {
      setLoadingGallery(true);
      fetch(`${API}/api/gallery`)
        .then(r => r.json())
        .then(d => {
          setGallery(d);
          setLoadingGallery(false);
        })
        .catch(() => setLoadingGallery(false));
    }
  }, [activeTab]);

  const tabs = [
    { id: 'cong-ty', label: 'Về công ty', icon: <Building2 size={18} /> },
    { id: 'nha-may', label: 'Nhà máy', icon: <Factory size={18} /> },
    { id: 'chung-nhan', label: 'Chứng nhận', icon: <Award size={18} /> },
    { id: 'hinh-anh', label: 'Hình ảnh hoạt động', icon: <Image size={18} /> },
  ];

  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Giới thiệu</span>
          </div>
          <h1 className="page-title">Giới thiệu</h1>
          <p className="page-desc">Tìm hiểu về Giải Pháp Dinh Dưỡng Đồng Tâm - Đối tác tin cậy của ngành chăn nuôi</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="about-tabs-wrapper">
        <div className="container">
          <div className="about-tabs">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={`/gioi-thieu/${tab.id}`}
                className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="section">
        <div className="container">
          {/* Về công ty */}
          {activeTab === 'cong-ty' && (
            <div className="about-content-section animate-fade-in-up">
              <div className="about-two-col">
                <div className="about-col-text">
                  <span className="section-label">VỀ ĐỒNG TÂM FEED</span>
                  <h2>Giải pháp dinh dưỡng <span className="text-green">bền vững</span></h2>
                  <p>{settings.aboutCompany || 'Công ty TNHH Giải pháp Dinh dưỡng Đồng Tâm được thành lập năm 2015...'}</p>

                  <div className="vision-mission-grid">
                    <div className="vm-card">
                      <div className="vm-icon"><Eye size={24} /></div>
                      <h3>Tầm nhìn</h3>
                      <p>{settings.vision || 'Trở thành doanh nghiệp hàng đầu Việt Nam trong lĩnh vực cung cấp nguyên liệu thức ăn chăn nuôi.'}</p>
                    </div>
                    <div className="vm-card">
                      <div className="vm-icon"><Target size={24} /></div>
                      <h3>Sứ mệnh</h3>
                      <p>{settings.mission || 'Cung cấp các giải pháp dinh dưỡng chất lượng cao, an toàn và bền vững.'}</p>
                    </div>
                  </div>

                  {settings.coreValues && settings.coreValues.length > 0 && (
                    <div className="core-values">
                      <h3>Giá trị cốt lõi</h3>
                      <div className="values-grid">
                        {settings.coreValues.map((value, i) => (
                          <div className="value-item" key={i}>
                            <Heart size={16} />
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="about-col-image">
                  <div className="about-img-box">
                    {settings.officeImage ? (
                      <img 
                        src={`${API}${settings.officeImage}`} 
                        alt="Trụ sở Đồng Tâm Feed" 
                        style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className="about-img-placeholder">
                        <Building2 size={64} strokeWidth={1} />
                        <span>Trụ sở Đồng Tâm Feed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nhà máy */}
          {activeTab === 'nha-may' && (
            <div className="about-content-section animate-fade-in-up">
              <div className="about-two-col">
                <div className="about-col-image">
                  <div className="about-img-box">
                    {settings.factoryImage ? (
                      <img 
                        src={`${API}${settings.factoryImage}`} 
                        alt="Nhà máy Đồng Tâm Feed" 
                        style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className="about-img-placeholder">
                        <Factory size={64} strokeWidth={1} />
                        <span>Nhà máy Đồng Tâm Feed</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="about-col-text">
                  <span className="section-label">NHÀ MÁY SẢN XUẤT</span>
                  <h2>Cơ sở vật chất <span className="text-green">hiện đại</span></h2>
                  <p>{settings.factoryInfo || 'Nhà máy Đồng Tâm Feed tọa lạc tại KCN Suối Dầu, Cam Lâm, Khánh Hòa...'}</p>

                  <div className="factory-specs">
                    <div className="factory-spec">
                      <div className="spec-number">5,000m²</div>
                      <div className="spec-label">Tổng diện tích</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">50 tấn</div>
                      <div className="spec-label">Công suất/ngày</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">3</div>
                      <div className="spec-label">Dây chuyền SX</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">ISO</div>
                      <div className="spec-label">Phòng kiểm nghiệm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chứng nhận */}
          {activeTab === 'chung-nhan' && (
            <div className="about-content-section animate-fade-in-up">
              <div className="certs-intro">
                <span className="section-label">CHỨNG NHẬN CHẤT LƯỢNG</span>
                <h2>Đạt chuẩn <span className="text-green">quốc tế</span></h2>
                <p>Tất cả sản phẩm của Đồng Tâm Feed đều được sản xuất theo quy trình nghiêm ngặt và đạt các chứng nhận chất lượng quốc tế.</p>
              </div>

              <div className="certs-grid">
                {(settings.certifications || [
                  'ISO 9001:2015 - Hệ thống quản lý chất lượng',
                  'ISO 22000:2018 - An toàn thực phẩm',
                  'GMP - Thực hành sản xuất tốt',
                  'HACCP - Phân tích mối nguy và kiểm soát điểm tới hạn'
                ]).map((cert, i) => (
                  <div className="cert-card" key={i}>
                    <div className="cert-icon">
                      <Shield size={32} />
                    </div>
                    <div className="cert-info">
                      <h3>{cert.split(' - ')[0]}</h3>
                      <p>{cert.split(' - ')[1] || cert}</p>
                    </div>
                    <CheckCircle2 size={20} className="cert-check" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thư viện ảnh */}
          {activeTab === 'hinh-anh' && (
            <div className="about-content-section animate-fade-in-up">
              <div className="certs-intro" style={{ marginBottom: '2rem' }}>
                <span className="section-label">THƯ VIỆN ẢNH</span>
                <h2>Hình ảnh <span className="text-green">hoạt động</span></h2>
                <p>Xem các hình ảnh về cơ sở vật chất, dây chuyền sản xuất và các chứng nhận chất lượng của Đồng Tâm Feed.</p>
              </div>

              {loadingGallery ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <div className="spinner"></div>
                </div>
              ) : gallery.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
                  Không có hình ảnh hoạt động nào.
                </div>
              ) : (
                <div className="about-gallery-masonry">
                  {gallery.map(img => (
                    <div 
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="about-gallery-card"
                    >
                      <div className="about-gallery-img-wrapper">
                        <img 
                          src={`${API}${img.image}`} 
                          alt={img.title} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
