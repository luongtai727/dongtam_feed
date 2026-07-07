import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle } from 'lucide-react';
import { applyCustomThemeColor } from '../../utils/theme';

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
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings)
      });
      if (settings.themeColorGreen) {
        applyCustomThemeColor(settings.themeColorGreen, 'primary', 'green');
      }
      if (settings.themeColorNavy) {
        applyCustomThemeColor(settings.themeColorNavy, 'secondary', 'navy');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Lỗi khi lưu cài đặt');
    }
    setSaving(false);
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
          <h3>Giao diện & Tông màu</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
            Tùy chỉnh màu sắc nhận diện thương hiệu cho toàn bộ website. Màu sắc mới sẽ tự động được áp dụng trên cả trang quản trị và trang giao diện khách hàng.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Tông màu chủ đạo (Màu chính)
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 'normal' }}>
                  (Mặc định: xanh lá cây #1e7d52)
                </span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" style={{ width: '60px', height: '40px', padding: '2px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }} value={settings.themeColorGreen || '#1e7d52'} onChange={e => update('themeColorGreen', e.target.value)} />
                <input type="text" className="form-input" style={{ flex: 1 }} value={settings.themeColorGreen || '#1e7d52'} onChange={e => update('themeColorGreen', e.target.value)} placeholder="#1e7d52" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Tông màu phụ (Màu navy)
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 'normal' }}>
                  (Mặc định: xanh navy #21354d)
                </span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" style={{ width: '60px', height: '40px', padding: '2px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }} value={settings.themeColorNavy || '#21354d'} onChange={e => update('themeColorNavy', e.target.value)} />
                <input type="text" className="form-input" style={{ flex: 1 }} value={settings.themeColorNavy || '#21354d'} onChange={e => update('themeColorNavy', e.target.value)} placeholder="#21354d" />
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
