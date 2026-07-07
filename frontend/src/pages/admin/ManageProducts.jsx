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
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState({
    name: '', slug: '', category: '', shortDesc: '', description: '',
    usage: '', packaging: '', storage: '', featured: false,
    specs: { protein: '', moisture: '', fat: '', ash: '' },
    highlights: '',
    uses: '',
    targets: '',
    ingredients: '',
    sensorySpecs: [{ indicator: '', requirement: '' }],
    qualitySpecs: [{ indicator: '', unit: '', value: '' }],
    usageNote: '',
    weight: '',
    shelfLife: '',
    shippingStandard: '',
    qualityCommitment: ''
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
      specs: { protein: '', moisture: '', fat: '', ash: '' },
      highlights: '',
      uses: '',
      targets: '',
      ingredients: '',
      sensorySpecs: [{ indicator: '', requirement: '' }],
      qualitySpecs: [{ indicator: '', unit: '', value: '' }],
      usageNote: '',
      weight: '',
      shelfLife: '',
      shippingStandard: '',
      qualityCommitment: ''
    });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
    setActiveTab('basic');
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      usage: product.usage || '',
      packaging: product.packaging || '',
      storage: product.storage || '',
      featured: product.featured,
      specs: product.specs || {},
      highlights: Array.isArray(product.highlights) ? product.highlights.join('\n') : (product.highlights || ''),
      uses: Array.isArray(product.uses) ? product.uses.join('\n') : (product.uses || ''),
      targets: Array.isArray(product.targets) ? product.targets.join('\n') : (product.targets || ''),
      ingredients: product.ingredients || '',
      sensorySpecs: Array.isArray(product.sensorySpecs) && product.sensorySpecs.length > 0 ? product.sensorySpecs : [{ indicator: '', requirement: '' }],
      qualitySpecs: Array.isArray(product.qualitySpecs) && product.qualitySpecs.length > 0 ? product.qualitySpecs : [{ indicator: '', unit: '', value: '' }],
      usageNote: product.usageNote || '',
      weight: product.weight || '',
      shelfLife: product.shelfLife || '',
      shippingStandard: product.shippingStandard || '',
      qualityCommitment: product.qualityCommitment || ''
    });
    setActiveTab('basic');
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
      } else if (key === 'highlights' || key === 'uses' || key === 'targets') {
        const arr = form[key].split('\n').map(s => s.trim()).filter(Boolean);
        formData.append(key, JSON.stringify(arr));
      } else if (key === 'sensorySpecs' || key === 'qualitySpecs') {
        const filtered = form[key].filter(item => {
          if (key === 'sensorySpecs') return item.indicator?.trim() || item.requirement?.trim();
          return item.indicator?.trim() || item.unit?.trim() || item.value?.trim();
        });
        formData.append(key, JSON.stringify(filtered));
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
          <div className="admin-modal" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="modal-close" onClick={resetForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              {/* Tab Selector */}
              <div className="admin-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', marginBottom: '1.5rem', gap: '1rem' }}>
                <button type="button" className={`admin-tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')} style={{ padding: '0.75rem 0.5rem', border: 'none', borderBottom: activeTab === 'basic' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'basic' ? '600' : '400', color: activeTab === 'basic' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  Thông tin cơ bản
                </button>
                <button type="button" className={`admin-tab-btn ${activeTab === 'extended' ? 'active' : ''}`} onClick={() => setActiveTab('extended')} style={{ padding: '0.75rem 0.5rem', border: 'none', borderBottom: activeTab === 'extended' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'extended' ? '600' : '400', color: activeTab === 'extended' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  Mô tả & Công dụng
                </button>
                <button type="button" className={`admin-tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} style={{ padding: '0.75rem 0.5rem', border: 'none', borderBottom: activeTab === 'specs' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'specs' ? '600' : '400', color: activeTab === 'specs' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  Thông số kỹ thuật
                </button>
                <button type="button" className={`admin-tab-btn ${activeTab === 'packaging' ? 'active' : ''}`} onClick={() => setActiveTab('packaging')} style={{ padding: '0.75rem 0.5rem', border: 'none', borderBottom: activeTab === 'packaging' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'packaging' ? '600' : '400', color: activeTab === 'packaging' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  Đóng gói & Bảo quản
                </button>
              </div>

              {/* Tab Content: Basic */}
              {activeTab === 'basic' && (
                <>
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
                    <label className="form-label">Mô tả ngắn (Hiển thị ở trang danh sách)</label>
                    <textarea className="form-textarea" rows="2" value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giới thiệu sản phẩm (Chi tiết)</label>
                    <textarea className="form-textarea" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                    <label htmlFor="featured" style={{ margin: 0 }}>Sản phẩm nổi bật (Hiển thị ở trang chủ)</label>
                  </div>
                </>
              )}

              {/* Tab Content: Extended */}
              {activeTab === 'extended' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Ưu điểm nổi bật (Mỗi dòng một ý)</label>
                    <textarea className="form-textarea" rows="5" value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} placeholder="Ví dụ:&#10;Nguồn nguyên liệu thủy sản ổn định&#10;Mùi thơm đặc trưng giúp tăng tính dẫn dụ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Công dụng (Mỗi dòng một ý)</label>
                    <textarea className="form-textarea" rows="5" value={form.uses} onChange={e => setForm({...form, uses: e.target.value})} placeholder="Ví dụ:&#10;Tăng tính dẫn dụ và kích thích bắt mồi&#10;Góp phần cải thiện lượng thức ăn tiêu thụ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đối tượng sử dụng (Mỗi dòng một ý)</label>
                    <textarea className="form-textarea" rows="5" value={form.targets} onChange={e => setForm({...form, targets: e.target.value})} placeholder="Ví dụ:&#10;Nhà máy sản xuất thức ăn thủy sản&#10;Nhà máy sản xuất thức ăn chăn nuôi" />
                  </div>
                </>
              )}

              {/* Tab Content: Specs */}
              {activeTab === 'specs' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Thành phần nguyên liệu</label>
                    <input className="form-input" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} placeholder="Ví dụ: 100% xác mắm tươi được thu gom từ các cơ sở..." />
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Chỉ tiêu cảm quan</label>
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => setForm({...form, sensorySpecs: [...form.sensorySpecs, { indicator: '', requirement: '' }]})}>
                        + Thêm dòng
                      </button>
                    </div>
                    <table className="admin-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Chỉ tiêu</th>
                          <th>Yêu cầu</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.sensorySpecs.map((spec, i) => (
                          <tr key={i}>
                            <td>
                              <input className="form-input" value={spec.indicator} onChange={e => {
                                const newSpecs = [...form.sensorySpecs];
                                newSpecs[i].indicator = e.target.value;
                                setForm({...form, sensorySpecs: newSpecs});
                              }} placeholder="Ví dụ: Trạng thái" />
                            </td>
                            <td>
                              <input className="form-input" value={spec.requirement} onChange={e => {
                                const newSpecs = [...form.sensorySpecs];
                                newSpecs[i].requirement = e.target.value;
                                setForm({...form, sensorySpecs: newSpecs});
                              }} placeholder="Ví dụ: Chất bột, xay mịn" />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button type="button" className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }} onClick={() => {
                                const newSpecs = form.sensorySpecs.filter((_, idx) => idx !== i);
                                setForm({...form, sensorySpecs: newSpecs.length ? newSpecs : [{ indicator: '', requirement: '' }]});
                              }}>Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Chỉ tiêu chất lượng</label>
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => setForm({...form, qualitySpecs: [...form.qualitySpecs, { indicator: '', unit: '', value: '' }]})}>
                        + Thêm dòng
                      </button>
                    </div>
                    <table className="admin-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Chỉ tiêu</th>
                          <th>Đơn vị</th>
                          <th>Giá trị</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.qualitySpecs.map((spec, i) => (
                          <tr key={i}>
                            <td>
                              <input className="form-input" value={spec.indicator} onChange={e => {
                                const newSpecs = [...form.qualitySpecs];
                                newSpecs[i].indicator = e.target.value;
                                setForm({...form, qualitySpecs: newSpecs});
                              }} placeholder="Ví dụ: Protein" />
                            </td>
                            <td>
                              <input className="form-input" value={spec.unit} onChange={e => {
                                const newSpecs = [...form.qualitySpecs];
                                newSpecs[i].unit = e.target.value;
                                setForm({...form, qualitySpecs: newSpecs});
                              }} placeholder="Ví dụ: g/100 g hoặc mg/kg" />
                            </td>
                            <td>
                              <input className="form-input" value={spec.value} onChange={e => {
                                const newSpecs = [...form.qualitySpecs];
                                newSpecs[i].value = e.target.value;
                                setForm({...form, qualitySpecs: newSpecs});
                              }} placeholder="Ví dụ: ≥ 25,0" />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button type="button" className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }} onClick={() => {
                                const newSpecs = form.qualitySpecs.filter((_, idx) => idx !== i);
                                setForm({...form, qualitySpecs: newSpecs.length ? newSpecs : [{ indicator: '', unit: '', value: '' }]});
                              }}>Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">Hướng dẫn sử dụng</label>
                    <textarea className="form-textarea" rows="2" value={form.usage} onChange={e => setForm({...form, usage: e.target.value})} placeholder="Khuyến nghị tỷ lệ sử dụng..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lưu ý khi sử dụng</label>
                    <textarea className="form-textarea" rows="2" value={form.usageNote} onChange={e => setForm({...form, usageNote: e.target.value})} placeholder="Ví dụ: Liều lượng phối trộn thực tế có thể điều chỉnh linh hoạt..." />
                  </div>

                  {/* Fallback for existing products */}
                  <div style={{ display: 'none' }}>
                    <input value={form.specs.protein || ''} onChange={e => setForm({...form, specs: {...form.specs, protein: e.target.value}})} />
                    <input value={form.specs.moisture || ''} onChange={e => setForm({...form, specs: {...form.specs, moisture: e.target.value}})} />
                    <input value={form.specs.fat || ''} onChange={e => setForm({...form, specs: {...form.specs, fat: e.target.value}})} />
                    <input value={form.specs.ash || ''} onChange={e => setForm({...form, specs: {...form.specs, ash: e.target.value}})} />
                  </div>
                </>
              )}

              {/* Tab Content: Packaging */}
              {activeTab === 'packaging' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Quy cách bao bì đóng gói</label>
                    <input className="form-input" value={form.packaging} onChange={e => setForm({...form, packaging: e.target.value})} placeholder="Ví dụ: Bao PP màu trắng hoặc màu xanh lá cây trơn..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trọng lượng đóng bao</label>
                    <input className="form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="Ví dụ: Cố định 50kg mỗi bao" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Điều kiện bảo quản</label>
                    <input className="form-input" value={form.storage} onChange={e => setForm({...form, storage: e.target.value})} placeholder="Ví dụ: Lưu trữ tại nhà kho sạch sẽ, thoáng mát..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hạn sử dụng</label>
                    <input className="form-input" value={form.shelfLife} onChange={e => setForm({...form, shelfLife: e.target.value})} placeholder="Ví dụ: Đạt chất lượng tối ưu trong vòng 06 tháng..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tiêu chuẩn vận chuyển</label>
                    <textarea className="form-textarea" rows="3" value={form.shippingStandard} onChange={e => setForm({...form, shippingStandard: e.target.value})} placeholder="Phương tiện chuyên chở luôn được kiểm tra kỹ lưỡng..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cam kết chất lượng</label>
                    <textarea className="form-textarea" rows="3" value={form.qualityCommitment} onChange={e => setForm({...form, qualityCommitment: e.target.value})} placeholder="Chúng tôi cam kết cung cấp sản phẩm có chất lượng ổn định..." />
                  </div>
                </>
              )}

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
