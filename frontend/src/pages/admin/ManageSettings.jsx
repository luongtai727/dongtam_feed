import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function ManageSettings() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Lỗi khi lưu cài đặt');
    }
    setSaving(false);
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload error');
      const data = await res.json();
      update(key, data.url);
    } catch {
      alert('Lỗi khi tải ảnh lên');
    }
  };

  const handleCertImageUpload = async (idx, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload error');
      const data = await res.json();
      const arr = [...(settings.certificateImages || [])];
      arr[idx] = { ...arr[idx], image: data.url };
      update('certificateImages', arr);
    } catch {
      alert('Lỗi khi tải ảnh chứng nhận lên');
    }
  };

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Cài đặt chung & Thông tin Công ty</h1>
          <p>Quản lý toàn bộ thông tin công ty, liên hệ, tầm nhìn, sứ mệnh, nhà máy và hình ảnh</p>
        </div>
        {saved && (
          <div className="save-toast">
            <CheckCircle size={16} /> Đã lưu thành công!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-section">
          <h3>Thông tin Công ty cơ bản</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên công ty (Tiếng Việt)</label>
              <input className="form-input" value={settings.companyName || ''} onChange={e => update('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tên công ty (Tiếng Anh)</label>
              <input className="form-input" value={settings.companyNameEn || ''} onChange={e => update('companyNameEn', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã số thuế (MST)</label>
              <input className="form-input" value={settings.taxCode || ''} onChange={e => update('taxCode', e.target.value)} placeholder="0316760462" />
            </div>
            <div className="form-group">
              <label className="form-label">Khẩu hiệu / Slogan</label>
              <input className="form-input" value={settings.tagline || ''} onChange={e => update('tagline', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu tổng quan về công ty</label>
            <textarea className="form-textarea" rows="4" value={settings.aboutCompany || ''} onChange={e => update('aboutCompany', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tầm nhìn (Vision)</label>
              <textarea className="form-textarea" rows="3" value={settings.vision || ''} onChange={e => update('vision', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sứ mệnh (Mission)</label>
              <textarea className="form-textarea" rows="3" value={settings.mission || ''} onChange={e => update('mission', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Thông tin & Quy mô Nhà máy sản xuất</label>
            <textarea className="form-textarea" rows="4" value={settings.factoryInfo || ''} onChange={e => update('factoryInfo', e.target.value)} placeholder="Mô tả về diện tích, công suất sấy công nghiệp, dây chuyền máy móc..." />
          </div>
        </div>

        <div className="settings-section">
          <h3>Thông tin Liên hệ & Địa chỉ</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số điện thoại bàn / Điện thoại</label>
              <input className="form-input" value={settings.phone || ''} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hotline tư vấn</label>
              <input className="form-input" value={settings.hotline || ''} onChange={e => update('hotline', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email liên hệ</label>
              <input className="form-input" value={settings.email || ''} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ làm việc</label>
              <input className="form-input" value={settings.workingHours || ''} onChange={e => update('workingHours', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ Văn phòng giao dịch</label>
            <input className="form-input" value={settings.address || ''} onChange={e => update('address', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ Nhà máy sản xuất</label>
            <input className="form-input" value={settings.factoryAddress || ''} onChange={e => update('factoryAddress', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Link bản đồ Google Maps (Embed URL)</label>
            <input className="form-input" value={settings.mapEmbed || ''} onChange={e => update('mapEmbed', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
          </div>
        </div>

        <div className="settings-section">
          <h3>Kênh truyền thông & Mạng xã hội</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fanpage Facebook</label>
              <input className="form-input" value={settings.facebook || ''} onChange={e => update('facebook', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Số Zalo liên hệ</label>
              <input className="form-input" value={settings.zalo || ''} onChange={e => update('zalo', e.target.value)} placeholder="0901234567" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Hình ảnh minh họa Công ty & Nhà máy</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Các hình ảnh này sẽ hiển thị tại các trang Giới thiệu (Về công ty, Nhà máy) và phần Giới thiệu ở Trang chủ.</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ảnh trụ sở văn phòng</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {settings.officeImage ? (
                  <img 
                    src={`${API}${settings.officeImage}`} 
                    alt="Office Preview" 
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }} 
                  />
                ) : (
                  <div style={{ width: '80px', height: '60px', background: 'var(--surface-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Không có ảnh</div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  id="office-img-file"
                  style={{ display: 'none' }} 
                  onChange={e => handleImageUpload('officeImage', e.target.files[0])} 
                />
                <label htmlFor="office-img-file" className="btn btn-outline btn-sm">Chọn ảnh</label>
                {settings.officeImage && (
                  <button type="button" className="btn btn-sm" style={{ color: 'var(--danger)', background: 'none', cursor: 'pointer' }} onClick={() => update('officeImage', '')}>Xóa</button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ảnh nhà máy sản xuất</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {settings.factoryImage ? (
                  <img 
                    src={`${API}${settings.factoryImage}`} 
                    alt="Factory Preview" 
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }} 
                  />
                ) : (
                  <div style={{ width: '80px', height: '60px', background: 'var(--surface-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Không có ảnh</div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  id="factory-img-file"
                  style={{ display: 'none' }} 
                  onChange={e => handleImageUpload('factoryImage', e.target.files[0])} 
                />
                <label htmlFor="factory-img-file" className="btn btn-outline btn-sm">Chọn ảnh</label>
                {settings.factoryImage && (
                  <button type="button" className="btn btn-sm" style={{ color: 'var(--danger)', background: 'none', cursor: 'pointer' }} onClick={() => update('factoryImage', '')}>Xóa</button>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-row" style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Ảnh phần Giới thiệu ở Trang chủ</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {settings.homeAboutImage ? (
                  <img 
                    src={`${API}${settings.homeAboutImage}`} 
                    alt="Home About Preview" 
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }} 
                  />
                ) : (
                  <div style={{ width: '80px', height: '60px', background: 'var(--surface-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Không có ảnh</div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  id="home-about-img-file"
                  style={{ display: 'none' }} 
                  onChange={e => handleImageUpload('homeAboutImage', e.target.files[0])} 
                />
                <label htmlFor="home-about-img-file" className="btn btn-outline btn-sm">Chọn ảnh</label>
                {settings.homeAboutImage && (
                  <button type="button" className="btn btn-sm" style={{ color: 'var(--danger)', background: 'none', cursor: 'pointer' }} onClick={() => update('homeAboutImage', '')}>Xóa</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============ STATS ============ */}
        <div className="settings-section">
          <h3>Thống kê nổi bật (Trang chủ)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Các con số hiển thị ở mục thống kê trên trang chủ (5,000m², 50 tấn, 200+, 10+...)</p>
          {(settings.stats || []).map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ width: '120px', flex: 'none' }} placeholder="Số liệu" value={stat.number || ''} onChange={e => {
                const arr = [...(settings.stats || [])];
                arr[idx] = { ...arr[idx], number: e.target.value };
                update('stats', arr);
              }} />
              <input className="form-input" style={{ flex: 1, minWidth: '120px' }} placeholder="Nhãn (VI)" value={stat.label || ''} onChange={e => {
                const arr = [...(settings.stats || [])];
                arr[idx] = { ...arr[idx], label: e.target.value };
                update('stats', arr);
              }} />
              <input className="form-input" style={{ flex: 1, minWidth: '120px' }} placeholder="Label (EN)" value={stat.labelEn || ''} onChange={e => {
                const arr = [...(settings.stats || [])];
                arr[idx] = { ...arr[idx], labelEn: e.target.value };
                update('stats', arr);
              }} />
              <input className="form-input" style={{ flex: 1, minWidth: '100px' }} placeholder="标签 (ZH)" value={stat.labelZh || ''} onChange={e => {
                const arr = [...(settings.stats || [])];
                arr[idx] = { ...arr[idx], labelZh: e.target.value };
                update('stats', arr);
              }} />
              <button type="button" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }} onClick={() => {
                const arr = (settings.stats || []).filter((_, i) => i !== idx);
                update('stats', arr);
              }}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => {
            const arr = [...(settings.stats || []), { number: '', label: '', labelEn: '', labelZh: '' }];
            update('stats', arr);
          }}>+ Thêm thống kê</button>
        </div>

        {/* ============ HERO CERTIFICATIONS ============ */}
        <div className="settings-section">
          <h3>Chứng nhận hiển thị trên Banner (ISO, HACCP, GMP...)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Các chứng nhận hiển thị dưới nút bấm trên banner trang chủ</p>
          {(settings.heroCertifications || []).map((cert, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input className="form-input" style={{ flex: 1 }} placeholder="Ví dụ: ISO 9001:2015" value={cert} onChange={e => {
                const arr = [...(settings.heroCertifications || [])];
                arr[idx] = e.target.value;
                update('heroCertifications', arr);
              }} />
              <button type="button" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }} onClick={() => {
                const arr = (settings.heroCertifications || []).filter((_, i) => i !== idx);
                update('heroCertifications', arr);
              }}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => {
            const arr = [...(settings.heroCertifications || []), ''];
            update('heroCertifications', arr);
          }}>+ Thêm chứng nhận</button>
        </div>

        {/* ============ HERO CARDS ============ */}
        <div className="settings-section">
          <h3>Thẻ nổi bật trên Banner (100% Tự nhiên, An toàn, Uy tín)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>3 thẻ thông tin hiển thị bên phải banner trang chủ</p>
          {(settings.heroCards || []).map((card, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Thẻ {idx + 1}</strong>
                <button type="button" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => {
                  const arr = (settings.heroCards || []).filter((_, i) => i !== idx);
                  update('heroCards', arr);
                }}>Xóa thẻ</button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tiêu đề (VI)</label>
                  <input className="form-input" value={card.title || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả (VI)</label>
                  <input className="form-input" value={card.desc || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], desc: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title (EN)</label>
                  <input className="form-input" value={card.titleEn || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], titleEn: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (EN)</label>
                  <input className="form-input" value={card.descEn || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], descEn: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">标题 (ZH)</label>
                  <input className="form-input" value={card.titleZh || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], titleZh: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
                <div className="form-group">
                  <label className="form-label">描述 (ZH)</label>
                  <input className="form-input" value={card.descZh || ''} onChange={e => {
                    const arr = [...(settings.heroCards || [])]; arr[idx] = { ...arr[idx], descZh: e.target.value }; update('heroCards', arr);
                  }} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => {
            const arr = [...(settings.heroCards || []), { title: '', titleEn: '', titleZh: '', desc: '', descEn: '', descZh: '' }];
            update('heroCards', arr);
          }}>+ Thêm thẻ</button>
        </div>

        {/* ============ CORE VALUES ============ */}
        <div className="settings-section">
          <h3>Giá trị cốt lõi (Trang Giới thiệu)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Quản lý danh sách Giá trị cốt lõi hỗ trợ 3 ngôn ngữ (VI / EN / ZH)</p>
          {(settings.coreValuesList || []).map((val, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ flex: 1, minWidth: '140px' }} placeholder="Tiêu đề (VI)" value={val.title || ''} onChange={e => {
                const arr = [...(settings.coreValuesList || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; update('coreValuesList', arr);
              }} />
              <input className="form-input" style={{ flex: 1, minWidth: '140px' }} placeholder="Title (EN)" value={val.titleEn || ''} onChange={e => {
                const arr = [...(settings.coreValuesList || [])]; arr[idx] = { ...arr[idx], titleEn: e.target.value }; update('coreValuesList', arr);
              }} />
              <input className="form-input" style={{ flex: 1, minWidth: '120px' }} placeholder="标题 (ZH)" value={val.titleZh || ''} onChange={e => {
                const arr = [...(settings.coreValuesList || [])]; arr[idx] = { ...arr[idx], titleZh: e.target.value }; update('coreValuesList', arr);
              }} />
              <button type="button" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }} onClick={() => {
                const arr = (settings.coreValuesList || []).filter((_, i) => i !== idx);
                update('coreValuesList', arr);
              }}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => {
            const arr = [...(settings.coreValuesList || []), { title: '', titleEn: '', titleZh: '' }];
            update('coreValuesList', arr);
          }}>+ Thêm giá trị cốt lõi</button>
        </div>

        {/* ============ CERTIFICATE IMAGES SLIDER ============ */}
        <div className="settings-section">
          <h3>Hình ảnh chụp Giấy chứng nhận (Certificate Slider)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Tải lên hình ảnh bằng cấp, chứng nhận, hồ sơ năng lực thực tế để hiển thị dạng slide thanh trượt bên dưới mục Chứng nhận</p>
          {(settings.certificateImages || []).map((item, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', background: 'var(--surface-subtle, #f8fafc)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Hình chứng nhận #{idx + 1}</strong>
                <button type="button" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => {
                  const arr = (settings.certificateImages || []).filter((_, i) => i !== idx);
                  update('certificateImages', arr);
                }}>✕ Xóa hình này</button>
              </div>
              <div className="form-row" style={{ alignItems: 'center' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Tên / Têu đề chứng nhận</label>
                  <input className="form-input" placeholder="Ví dụ: Giấy chứng nhận ISO 9001:2015" value={item.title || ''} onChange={e => {
                    const arr = [...(settings.certificateImages || [])];
                    arr[idx] = { ...arr[idx], title: e.target.value };
                    update('certificateImages', arr);
                  }} />
                </div>
                <div className="form-group" style={{ width: 'auto' }}>
                  <label className="form-label">Ảnh chứng chỉ</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {item.image ? (
                      <img
                        src={`${API}${item.image}`}
                        alt="Cert preview"
                        style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}
                      />
                    ) : (
                      <div style={{ width: '70px', height: '50px', background: 'var(--surface-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Chưa có ảnh</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`cert-img-file-${idx}`}
                      style={{ display: 'none' }}
                      onChange={e => handleCertImageUpload(idx, e.target.files[0])}
                    />
                    <label htmlFor={`cert-img-file-${idx}`} className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      Chọn ảnh
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => {
            const arr = [...(settings.certificateImages || []), { id: `cert-${Date.now()}`, title: '', image: '' }];
            update('certificateImages', arr);
          }}>+ Thêm hình chứng nhận</button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu tất cả cài đặt'}
          </button>
        </div>
      </form>
    </div>
  );
}
