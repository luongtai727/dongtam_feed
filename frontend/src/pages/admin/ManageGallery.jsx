import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Trash2, Image as ImageIcon, Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageGallery() {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadImages = () => {
    setLoading(true);
    fetch(`${API}/api/gallery`)
      .then(r => r.json())
      .then(d => {
        setImages(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Vui lòng nhập tiêu đề ảnh');
    if (!imageFile) return alert('Vui lòng chọn tệp ảnh');

    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      const res = await fetch(`${API}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi server');
      }
      showToast('Đã thêm ảnh mới thành công!');
      loadImages();
      resetForm();
    } catch (err) {
      alert(err.message || 'Lỗi khi tải ảnh lên');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này khỏi thư viện?')) return;
    try {
      const res = await fetch(`${API}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Không thể xóa');
      showToast('Đã xóa ảnh thành công!');
      loadImages();
    } catch {
      alert('Lỗi khi xóa ảnh');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Hình ảnh hoạt động</h1>
          <p>Quản lý hình ảnh nhà máy, chứng nhận và hoạt động của công ty</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Thêm ảnh mới
        </button>
        {toastMsg && (
          <div className="save-toast">
            <CheckCircle size={16} /> {toastMsg}
          </div>
        )}
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={resetForm}>
          <div className="admin-modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Tải lên ảnh mới</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-group">
                <label className="form-label">Tiêu đề ảnh / Chú thích</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Dây chuyền sấy công nghiệp"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chọn tệp ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="gallery-file-input"
                />
                <label
                  htmlFor="gallery-file-input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    cursor: 'pointer',
                    background: 'var(--surface-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
                    />
                  ) : (
                    <>
                      <ImageIcon size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nhấp để chọn ảnh</span>
                    </>
                  )}
                </label>
              </div>

              <div className="admin-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm} disabled={saving}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={18} /> {saving ? 'Đang tải lên...' : 'Lưu ảnh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
          <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Thư viện ảnh chưa có nội dung</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Hãy thêm các hình ảnh về nhà máy, sản phẩm và hoạt động của công ty để giới thiệu đến khách hàng.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Thêm ảnh đầu tiên
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}
        >
          {images.map(img => (
            <div
              key={img.id}
              style={{
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ width: '100%', height: '180px', background: 'var(--surface-muted)', position: 'relative' }}>
                <img
                  src={`${API}${img.image}`}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all 0.2s'
                  }}
                  title="Xóa ảnh"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.4' }}>
                  {img.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Đã tải lên: {new Date(img.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
