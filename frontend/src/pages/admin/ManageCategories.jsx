import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit3, Trash2, X, Save, Tag, FolderTree } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

const TYPE_LABELS = {
  product: 'Sản phẩm',
  news: 'Tin tức'
};

export default function ManageCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'product', subtitle: '', description: '', order: 1 });
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const loadCategories = () => {
    fetch(`${API}/api/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  };

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => {
    setForm({ name: '', type: 'product', subtitle: '', description: '', order: categories.length + 1 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      type: cat.type,
      subtitle: cat.subtitle || '',
      description: cat.description || '',
      order: cat.order || 1
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Tên danh mục không được để trống');
    setSaving(true);

    try {
      const url = editing ? `${API}/api/categories/${editing.id}` : `${API}/api/categories`;
      const method = editing ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      loadCategories();
      resetForm();
    } catch (err) {
      alert('Lỗi khi lưu danh mục');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) return;
    try {
      await fetch(`${API}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCategories();
    } catch {
      alert('Lỗi khi xóa');
    }
  };

  const filteredCategories = filterType === 'all'
    ? categories
    : categories.filter(c => c.type === filterType);

  const productCats = categories.filter(c => c.type === 'product');
  const newsCats = categories.filter(c => c.type === 'news');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Danh mục</h1>
          <p>Thêm, sửa và xóa danh mục cho sản phẩm và tin tức</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          className={`dash-stat-card ${filterType === 'all' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filterType === 'all' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilterType('all')}
        >
          <div className="dsc-icon" style={{ background: 'var(--gradient-primary)' }}>
            <FolderTree size={22} />
          </div>
          <div>
            <div className="dsc-value">{categories.length}</div>
            <div className="dsc-label">Tất cả danh mục</div>
          </div>
        </div>
        <div
          className={`dash-stat-card ${filterType === 'product' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filterType === 'product' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilterType('product')}
        >
          <div className="dsc-icon" style={{ background: 'var(--gradient-secondary)' }}>
            <Tag size={22} />
          </div>
          <div>
            <div className="dsc-value">{productCats.length}</div>
            <div className="dsc-label">Danh mục sản phẩm</div>
          </div>
        </div>
        <div
          className={`dash-stat-card ${filterType === 'news' ? 'green' : ''}`}
          style={{ cursor: 'pointer', border: filterType === 'news' ? '2px solid var(--green-500)' : undefined }}
          onClick={() => setFilterType('news')}
        >
          <div className="dsc-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Tag size={22} />
          </div>
          <div>
            <div className="dsc-value">{newsCats.length}</div>
            <div className="dsc-label">Danh mục tin tức</div>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={resetForm}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-group">
                <label className="form-label">Tên danh mục *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Ví dụ: AMINO ACID BIỂN SÂU - PHỤ PHẨM TỪ MỰC BIỂN"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Loại danh mục *</label>
                  <select
                    className="form-input"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}
                  >
                    <option value="product">Sản phẩm</option>
                    <option value="news">Tin tức</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.order}
                    onChange={e => setForm({...form, order: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
              </div>
              {form.type === 'product' && (
                <div className="form-group">
                  <label className="form-label">Dòng trích phụ (Subtitle)</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={form.subtitle}
                    onChange={e => setForm({...form, subtitle: e.target.value})}
                    placeholder="Ví dụ: Nhóm cung cấp giải pháp dẫn dụ và dinh dưỡng..."
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Mô tả ngắn..."
                />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>STT</th>
              <th>Tên danh mục</th>
              <th>Loại</th>
              <th>Subtitle</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(cat => (
              <tr key={cat.id}>
                <td><strong>#{cat.order || '—'}</strong></td>
                <td><strong>{cat.name}</strong></td>
                <td>
                  <span className={`badge ${cat.type === 'product' ? 'badge-green' : 'badge-gold'}`}>
                    {TYPE_LABELS[cat.type] || cat.type}
                  </span>
                </td>
                <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  {cat.subtitle || '—'}
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(cat)}>
                      <Edit3 size={14} /> Sửa
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id, cat.name)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && <div className="admin-empty">Chưa có danh mục nào</div>}
      </div>
    </div>
  );
}
