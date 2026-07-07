import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit3, Trash2, X, Save, Image } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', category: '', shortDesc: '', description: '',
    usage: '', packaging: '', storage: '', featured: false,
    specs: { protein: '', moisture: '', fat: '', ash: '' }
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    fetch(`${API}/api/products`).then(r => r.json()).then(setProducts).catch(() => {});
  };

  const loadCategories = () => {
    fetch(`${API}/api/categories?type=product`).then(r => r.json()).then(setCategories).catch(() => {});
  };

  useEffect(() => { loadProducts(); loadCategories(); }, []);

  const resetForm = () => {
    setForm({
      name: '', slug: '', category: '', shortDesc: '', description: '',
      usage: '', packaging: '', storage: '', featured: false,
      specs: { protein: '', moisture: '', fat: '', ash: '' }
    });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      shortDesc: product.shortDesc,
      description: product.description,
      usage: product.usage,
      packaging: product.packaging,
      storage: product.storage || '',
      featured: product.featured,
      specs: product.specs || {}
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Tên sản phẩm không được để trống');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'specs') {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });
    if (imageFile) formData.append('image', imageFile);

    try {
      const url = editing ? `${API}/api/products/${editing.id}` : `${API}/api/products`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi server');
      }
      loadProducts();
      resetForm();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu sản phẩm');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await fetch(`${API}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadProducts();
    } catch {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Sản phẩm</h1>
          <p>Thêm, sửa và xóa sản phẩm nguyên liệu thức ăn chăn nuôi</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={resetForm}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tên sản phẩm *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug (URL)</label>
                  <input className="form-input" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="tu-dong-tao" />
                </div>
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
                <label className="form-label">Mô tả ngắn</label>
                <textarea className="form-textarea" rows="2" value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả chi tiết</label>
                <textarea className="form-textarea" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Hướng dẫn sử dụng</label>
                <textarea className="form-textarea" rows="2" value={form.usage} onChange={e => setForm({...form, usage: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quy cách đóng gói</label>
                  <input className="form-input" value={form.packaging} onChange={e => setForm({...form, packaging: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bảo quản</label>
                  <input className="form-input" value={form.storage} onChange={e => setForm({...form, storage: e.target.value})} />
                </div>
              </div>

              <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>Thông số kỹ thuật</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Protein</label>
                  <input className="form-input" value={form.specs.protein || ''} onChange={e => setForm({...form, specs: {...form.specs, protein: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Độ ẩm</label>
                  <input className="form-input" value={form.specs.moisture || ''} onChange={e => setForm({...form, specs: {...form.specs, moisture: e.target.value}})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Chất béo</label>
                  <input className="form-input" value={form.specs.fat || ''} onChange={e => setForm({...form, specs: {...form.specs, fat: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tro</label>
                  <input className="form-input" value={form.specs.ash || ''} onChange={e => setForm({...form, specs: {...form.specs, ash: e.target.value}})} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured" style={{ margin: 0 }}>Sản phẩm nổi bật</label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={`${API}${p.image}`} alt="" className="admin-thumb" />
                  ) : (
                    <div className="admin-thumb-placeholder"><Image size={16} /></div>
                  )}
                </td>
                <td><strong>{p.name}</strong></td>
                <td><span className="badge badge-green">{p.category}</span></td>
                <td>{p.featured ? <span className="badge badge-gold">⭐ Nổi bật</span> : <span className="badge badge-navy">Thường</span>}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}><Edit3 size={14} /> Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="admin-empty">Chưa có sản phẩm nào</div>}
      </div>
    </div>
  );
}
