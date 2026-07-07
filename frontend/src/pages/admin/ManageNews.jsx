import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit3, Trash2, X, Save, Image } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageNews() {
  const { token } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', category: '', summary: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadNews = () => {
    fetch(`${API}/api/news`).then(r => r.json()).then(setNewsList).catch(() => {});
  };

  const loadCategories = () => {
    fetch(`${API}/api/categories?type=news`).then(r => r.json()).then(setCategories).catch(() => {});
  };

  useEffect(() => { loadNews(); loadCategories(); }, []);

  const resetForm = () => {
    setForm({ title: '', slug: '', category: '', summary: '', content: '' });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (article) => {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Tiêu đề không được để trống');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      const url = editing ? `${API}/api/news/${editing.id}` : `${API}/api/news`;
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi server');
      }
      loadNews();
      resetForm();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu bài viết');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await fetch(`${API}/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadNews();
    } catch {
      alert('Lỗi khi xóa bài viết');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Tin tức</h1>
          <p>Thêm, sửa và xóa bài viết tin tức</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={resetForm}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Sửa bài viết' : 'Viết bài mới'}</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-group">
                <label className="form-label">Tiêu đề *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hình ảnh</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tóm tắt</label>
                <textarea className="form-textarea" rows="2" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung</label>
                <textarea className="form-textarea" rows="8" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map(n => (
              <tr key={n.id}>
                <td>
                  {n.image ? <img src={`${API}${n.image}`} alt="" className="admin-thumb" /> : <div className="admin-thumb-placeholder"><Image size={16} /></div>}
                </td>
                <td><strong>{n.title}</strong></td>
                <td><span className="badge badge-green">{n.category}</span></td>
                <td>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(n)}><Edit3 size={14} /> Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(n.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {newsList.length === 0 && <div className="admin-empty">Chưa có bài viết nào</div>}
      </div>
    </div>
  );
}
