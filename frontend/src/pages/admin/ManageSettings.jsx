import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Cài đặt chung</h1>
          <p>Cập nhật thông tin công ty và cấu hình website</p>
        </div>
        {saved && (
          <div className="save-toast">
            <CheckCircle size={16} /> Đã lưu thành công!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-section">
          <h3>Thông tin công ty</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên công ty</label>
              <input className="form-input" value={settings.companyName || ''} onChange={e => update('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tên tiếng Anh</label>
              <input className="form-input" value={settings.companyNameEn || ''} onChange={e => update('companyNameEn', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Slogan</label>
            <input className="form-input" value={settings.tagline || ''} onChange={e => update('tagline', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu công ty</label>
            <textarea className="form-textarea" rows="4" value={settings.aboutCompany || ''} onChange={e => update('aboutCompany', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tầm nhìn</label>
              <textarea className="form-textarea" rows="3" value={settings.vision || ''} onChange={e => update('vision', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sứ mệnh</label>
              <textarea className="form-textarea" rows="3" value={settings.mission || ''} onChange={e => update('mission', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Liên hệ</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Điện thoại</label>
              <input className="form-input" value={settings.phone || ''} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hotline</label>
              <input className="form-input" value={settings.hotline || ''} onChange={e => update('hotline', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={settings.email || ''} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ làm việc</label>
              <input className="form-input" value={settings.workingHours || ''} onChange={e => update('workingHours', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ văn phòng</label>
            <input className="form-input" value={settings.address || ''} onChange={e => update('address', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ nhà máy</label>
            <input className="form-input" value={settings.factoryAddress || ''} onChange={e => update('factoryAddress', e.target.value)} />
          </div>
        </div>

        <div className="settings-section">
          <h3>Mạng xã hội</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input className="form-input" value={settings.facebook || ''} onChange={e => update('facebook', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Zalo</label>
              <input className="form-input" value={settings.zalo || ''} onChange={e => update('zalo', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Hình ảnh giới thiệu công ty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Các hình ảnh này sẽ hiển thị tại trang Giới thiệu (Về công ty, Nhà máy) và phần Giới thiệu ở Trang chủ.</p>
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

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </form>
    </div>
  );
}
