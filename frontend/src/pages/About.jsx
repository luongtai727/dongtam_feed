import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Factory, Award, Eye, Target, Heart, Shield, CheckCircle2, ChevronRight, ChevronLeft, ZoomIn, Image, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const API = import.meta.env.VITE_API_URL || '';

export default function About() {
  const { t, language } = useLanguage();
  const { section } = useParams();
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('cong-ty');
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const certSliderRef = useRef(null);

  const scrollCertsLeft = () => {
    if (certSliderRef.current) {
      certSliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollCertsRight = () => {
    if (certSliderRef.current) {
      certSliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetch(`${API}/api/settings?_t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()).then(setSettings).catch(() => {});
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
    { id: 'cong-ty', label: t('nav.aboutCompany'), icon: <Building2 size={18} /> },
    { id: 'nha-may', label: t('nav.factory'), icon: <Factory size={18} /> },
    { id: 'chung-nhan', label: t('nav.certs'), icon: <Award size={18} /> },
    { id: 'hinh-anh', label: t('nav.gallery'), icon: <Image size={18} /> },
  ];

  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav.home')}</Link>
            <ChevronRight size={14} />
            <span>{t('nav.about')}</span>
          </div>
          <h1 className="page-title">{t('nav.about')}</h1>
          <p className="page-desc">{language === 'vi' ? (settings.tagline || t('hero.desc')) : t('hero.desc')}</p>
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
                  <span className="section-label">
                    {language === 'vi' ? 'VỀ ĐỒNG TÂM FEED' : language === 'en' ? 'ABOUT DONG TAM FEED' : '关于同心饲料'}
                  </span>
                  <h2>{t('aboutPreview.title')}</h2>
                  <p>{language === 'vi' ? (settings.aboutCompany || t('aboutPreview.desc')) : t('aboutPreview.desc')}</p>

                  <div className="vision-mission-grid">
                    <div className="vm-card">
                      <div className="vm-icon"><Eye size={24} /></div>
                      <h3>{language === 'vi' ? 'Tầm nhìn' : language === 'en' ? 'Vision' : '企业愿景'}</h3>
                      <p>
                        {language === 'vi' 
                          ? (settings.vision || 'Trở thành doanh nghiệp hàng đầu Việt Nam trong lĩnh vực cung cấp nguyên liệu thức ăn chăn nuôi.') 
                          : language === 'en' 
                            ? 'To become a leading enterprise in Vietnam in supplying sustainable marine feed ingredients, reaching out to international markets.' 
                            : '成为越南提供可持续海洋饲料原料领域的领先企业，并向国际市场进军。'}
                      </p>
                    </div>
                    <div className="vm-card">
                      <div className="vm-icon"><Target size={24} /></div>
                      <h3>{language === 'vi' ? 'Sứ mệnh' : language === 'en' ? 'Mission' : '企业使命'}</h3>
                      <p>
                        {language === 'vi' 
                          ? (settings.mission || 'Cung cấp các giải pháp dinh dưỡng chất lượng cao, an toàn và bền vững.') 
                          : language === 'en' 
                            ? 'Providing high-quality, safe, and sustainable nutritional solutions for animal husbandry, contributing to manufacturing efficiency and environmental protection.' 
                            : '为饲料工业提供高品质、安全、可持续的营养解决方案，助力提高生产效益并保护生态环境。'}
                      </p>
                    </div>
                  </div>

                    <div className="core-values">
                      <h3>{language === 'vi' ? 'Giá trị cốt lõi' : language === 'en' ? 'Core Values' : '核心价值'}</h3>
                      <div className="values-grid">
                        {(() => {
                          const defaultList = [
                            { title: 'Chất lượng là nền tảng', titleEn: 'Quality is the Foundation', titleZh: '质量为本' },
                            { title: 'Khách hàng là trọng tâm', titleEn: 'Customer Centricity', titleZh: '客户中心' },
                            { title: 'Sáng tạo không ngừng', titleEn: 'Continuous Innovation', titleZh: '持续创新' },
                            { title: 'Phát triển bền vững', titleEn: 'Sustainable Development', titleZh: '绿色发展' }
                          ];
                          const list = (settings.coreValuesList && settings.coreValuesList.length > 0)
                            ? settings.coreValuesList
                            : defaultList;
                          return list.map((item, i) => (
                            <div className="value-item" key={i}>
                              <Heart size={16} />
                              <span>
                                {language === 'en' ? (item.titleEn || item.title) : language === 'zh' ? (item.titleZh || item.title) : item.title}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
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
                        <span>{language === 'vi' ? 'Trụ sở Đồng Tâm Feed' : language === 'en' ? 'Dong Tam Feed Headquarters' : '同心饲料总部'}</span>
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
                        <span>{language === 'vi' ? 'Nhà máy Đồng Tâm Feed' : language === 'en' ? 'Dong Tam Feed Factory' : '同心饲料厂区'}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="about-col-text">
                  <span className="section-label">
                    {language === 'vi' ? 'NHÀ MÁY SẢN XUẤT' : language === 'en' ? 'PRODUCTION FACTORY' : '生产基地'}
                  </span>
                  <h2>{t('aboutPage.factoryTitle')}</h2>
                  <p>
                    {language === 'vi' 
                      ? (settings.factoryInfo || 'Nhà máy Đồng Tâm Feed tọa lạc tại KCN Suối Dầu, Cam Lâm, Khánh Hòa...') 
                      : language === 'en' 
                        ? 'Dong Tam Feed Factory is located in Suoi Dau Industrial Zone, Cam Lam, Khanh Hoa province with a total area of 5,000m². The factory is equipped with an industrial drying system with a capacity of 50 tons/day, automated grinding and packaging lines, and a modern testing laboratory.' 
                        : '同心饲料工厂位于庆和省甘林县绥油（Suoi Dau）工业区，总面积达5000平方米。工厂配备日产能50吨的工业烘干系统、自动研磨和包装生产线以及现代化的实验室。'}
                  </p>

                  <div className="factory-specs">
                    <div className="factory-spec">
                      <div className="spec-number">5,000m²</div>
                      <div className="spec-label">{t('aboutPage.totalArea')}</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">50 {language === 'vi' ? 'tấn' : language === 'en' ? 'tons' : '吨'}</div>
                      <div className="spec-label">{t('aboutPage.dailyCapacity')}</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">3</div>
                      <div className="spec-label">{t('aboutPage.linesCount')}</div>
                    </div>
                    <div className="factory-spec">
                      <div className="spec-number">ISO</div>
                      <div className="spec-label">{t('aboutPage.labStandard')}</div>
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
                <span className="section-label">
                  {language === 'vi' ? 'CHỨNG NHẬN CHẤT LƯỢNG' : language === 'en' ? 'QUALITY CERTIFICATIONS' : '管理体系认证'}
                </span>
                <h2>{t('aboutPage.certsTitle')}</h2>
                <p>{t('aboutPage.certsDesc')}</p>
              </div>

              <div className="certs-grid">
                {(() => {
                  const defaultCerts = [
                    { id: 'cert-1', title: 'ISO 9001:2015', subtitle: 'Hệ thống quản lý chất lượng', subtitleEn: 'Quality Management System', subtitleZh: '质量管理体系', image: '/uploads/1783437305283-1b79b624.jpg' },
                    { id: 'cert-2', title: 'ISO 22000:2018', subtitle: 'An toàn thực phẩm', subtitleEn: 'Food Safety Management System', subtitleZh: '食品安全管理体系', image: '/uploads/1783437307673-a6b5b19c.jpg' },
                    { id: 'cert-3', title: 'GMP Standard', subtitle: 'Thực hành sản xuất tốt', subtitleEn: 'Good Manufacturing Practices', subtitleZh: '良好生产规范', image: '/uploads/1783437437958-5ac758ba.jpg' },
                    { id: 'cert-4', title: 'HACCP Standard', subtitle: 'Phân tích mối nguy và kiểm soát điểm tới hạn', subtitleEn: 'Hazard Analysis Critical Control Point', subtitleZh: '危害分析与关键控制点', image: '/uploads/1783437305283-1b79b624.jpg' }
                  ];
                  const certList = (settings.certificationsList && settings.certificationsList.length > 0)
                    ? settings.certificationsList
                    : defaultCerts;

                  return certList.map((item, i) => {
                    const subtitleText = language === 'en' ? (item.subtitleEn || item.subtitle) : language === 'zh' ? (item.subtitleZh || item.subtitle) : item.subtitle;

                    return (
                      <div 
                        className={`cert-card ${item.image ? 'has-image' : ''}`} 
                        key={item.id || i}
                        onClick={() => item.image && setSelectedCert({ title: item.title, image: item.image })}
                        style={{ cursor: item.image ? 'pointer' : 'default' }}
                      >
                        <div className="cert-icon">
                          <Shield size={32} />
                        </div>
                        <div className="cert-info">
                          <h3>{item.title}</h3>
                          <p>{subtitleText}</p>
                        </div>
                        {item.image ? (
                          <div className="cert-view-badge" title="Bấm xem ảnh chứng nhận">
                            <ZoomIn size={16} /> <span>{language === 'vi' ? 'Xem ảnh' : language === 'en' ? 'View Photo' : '查看照片'}</span>
                          </div>
                        ) : (
                          <CheckCircle2 size={20} className="cert-check" />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Slider Hình ảnh chụp Chứng chỉ riêng từng loại */}
              <div className="cert-slider-section" style={{ marginTop: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="section-label" style={{ marginBottom: '0.25rem', display: 'block' }}>
                      {language === 'vi' ? 'HÌNH ẢNH THỰC TẾ CHỨNG CHỈ' : language === 'en' ? 'ACTUAL CERTIFICATE PHOTOS' : '证书实拍'}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700' }}>
                      {language === 'vi' ? 'Bằng cấp & Giấy chứng nhận sản xuất' : language === 'en' ? 'Production Certificates & Qualifications' : '生产资质证书'}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={scrollCertsLeft} className="cert-nav-btn" title="Trước">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={scrollCertsRight} className="cert-nav-btn" title="Sau">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="cert-slider-wrapper" ref={certSliderRef}>
                  {(() => {
                    const defaultCerts = [
                      { id: 'cert-1', title: 'ISO 9001:2015', image: '/uploads/1783437305283-1b79b624.jpg' },
                      { id: 'cert-2', title: 'ISO 22000:2018', image: '/uploads/1783437307673-a6b5b19c.jpg' },
                      { id: 'cert-3', title: 'GMP Standard', image: '/uploads/1783437437958-5ac758ba.jpg' },
                      { id: 'cert-4', title: 'HACCP Standard', image: '/uploads/1783437305283-1b79b624.jpg' }
                    ];
                    const listWithImgs = (settings.certificationsList && settings.certificationsList.length > 0)
                      ? settings.certificationsList.filter(c => c.image)
                      : defaultCerts;

                    return listWithImgs.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="cert-slide-card"
                        onClick={() => setSelectedCert({ title: item.title, image: item.image })}
                      >
                        <div className="cert-img-container">
                          <img src={`${API}${item.image}`} alt={item.title} />
                          <div className="cert-img-overlay">
                            <ZoomIn size={24} color="#fff" />
                            <span>{language === 'vi' ? 'Xem phóng to' : language === 'en' ? 'Zoom In' : '点击放大'}</span>
                          </div>
                        </div>
                        <h4 className="cert-slide-title">{item.title}</h4>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Thư viện ảnh */}
          {activeTab === 'hinh-anh' && (
            <div className="about-content-section animate-fade-in-up">
              <div className="certs-intro" style={{ marginBottom: '2rem' }}>
                <span className="section-label">{t('nav.gallery')}</span>
                <h2>{t('aboutPage.galleryTitle')}</h2>
                <p>{t('aboutPage.galleryDesc')}</p>
              </div>

              {loadingGallery ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <div className="spinner"></div>
                </div>
              ) : gallery.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
                  {language === 'vi' ? 'Không có hình ảnh hoạt động nào.' : language === 'en' ? 'No gallery images available.' : '暂无活动照片。'}
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
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL OVERLAY */}
      {(selectedCert || selectedImage) && (
        <div className="about-gallery-modal" onClick={() => { setSelectedCert(null); setSelectedImage(null); }}>
          <div className="about-gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => { setSelectedCert(null); setSelectedImage(null); }}
            >
              <X size={22} /> {language === 'vi' ? 'Đóng' : language === 'en' ? 'Close' : '关闭'}
            </button>
            <img 
              src={`${API}${(selectedCert || selectedImage).image}`} 
              alt={(selectedCert || selectedImage).title} 
            />
            {(selectedCert || selectedImage).title && (
              <h3>{(selectedCert || selectedImage).title}</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
