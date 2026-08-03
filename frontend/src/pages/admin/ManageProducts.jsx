import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit3, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

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
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
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
    setExistingImages([]);
    setImageFiles([]);
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
    const imgs = product.images && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [];
    setExistingImages(imgs);
    setImageFiles([]);
    setActiveTab('basic');
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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

    formData.append('existingImages', JSON.stringify(existingImages));
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

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
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
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
                  Thông số kỹ thuật & Tiêu chuẩn
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
                      <label className="form-label">Bộ sưu tập hình ảnh (Chọn 1 hoặc nhiều ảnh)</label>
                      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="form-input" />
                    </div>
                  </div>

                  {/* Image Previews */}
                  {(existingImages.length > 0 || imageFiles.length > 0) && (
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Hình ảnh sản phẩm ({existingImages.length + imageFiles.length} ảnh):</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                        {existingImages.map((img, idx) => (
                          <div key={`exist-${idx}`} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <img src={`${API}${img}`} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <X size={14} />
                            </button>
                            {idx === 0 && <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: 3 }}>Ảnh chính</span>}
                          </div>
                        ))}
                        {imageFiles.map((file, idx) => (
                          <div key={`new-${idx}`} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px dashed var(--primary)' }}>
                            <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => removeNewImage(idx)}
                              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <X size={14} />
                            </button>
                            {existingImages.length === 0 && idx === 0 && <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: 3 }}>Ảnh chính</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '1rem' }}>
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
                    <textarea className="form-textarea" rows="4" value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} placeholder="Ví dụ:&#10;Nguồn nguyên liệu thủy sản ổn định&#10;Mùi thơm đặc trưng giúp tăng tính dẫn dụ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Công dụng (Mỗi dòng một ý)</label>
                    <textarea className="form-textarea" rows="4" value={form.uses} onChange={e => setForm({...form, uses: e.target.value})} placeholder="Ví dụ:&#10;Tăng tính dẫn dụ và kích thích bắt mồi&#10;Góp phần cải thiện lượng thức ăn tiêu thụ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đối tượng sử dụng (Mỗi dòng một ý)</label>
                    <textarea className="form-textarea" rows="4" value={form.targets} onChange={e => setForm({...form, targets: e.target.value})} placeholder="Ví dụ:&#10;Nhà máy sản xuất thức ăn thủy sản&#10;Nhà máy sản xuất thức ăn chăn nuôi" />
                  </div>
                </>
              )}

              {/* Tab Content: Specs */}
              {activeTab === 'specs' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Thành phần nguyên liệu</label>
                    <input className="form-input" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} placeholder="Ví dụ: 100% Xác mắm tươi thu gom từ các cơ sở..." />
                  </div>

                  {/* Dynamic Sensory Specs */}
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Chỉ tiêu cảm quan (Thêm/xóa số dòng linh hoạt)</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => setForm({...form, sensorySpecs: [...form.sensorySpecs, { indicator: '', requirement: '' }]})}
                      >
                        <Plus size={14} /> Thêm dòng
                      </button>
                    </div>
                    {form.sensorySpecs.map((item, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 40px', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          className="form-input"
                          placeholder="Chỉ tiêu (ví dụ: Màu sắc)"
                          value={item.indicator}
                          onChange={e => {
                            const updated = [...form.sensorySpecs];
                            updated[idx].indicator = e.target.value;
                            setForm({...form, sensorySpecs: updated});
                          }}
                        />
                        <input
                          className="form-input"
                          placeholder="Yêu cầu (ví dụ: Màu nâu đất đến nâu đậm đặc trưng)"
                          value={item.requirement}
                          onChange={e => {
                            const updated = [...form.sensorySpecs];
                            updated[idx].requirement = e.target.value;
                            setForm({...form, sensorySpecs: updated});
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            const updated = form.sensorySpecs.filter((_, i) => i !== idx);
                            setForm({...form, sensorySpecs: updated.length ? updated : [{ indicator: '', requirement: '' }]});
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Quality Specs */}
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Chỉ tiêu chất lượng (Thêm/xóa số dòng linh hoạt)</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => setForm({...form, qualitySpecs: [...form.qualitySpecs, { indicator: '', unit: '', value: '' }]})}
                      >
                        <Plus size={14} /> Thêm dòng
                      </button>
                    </div>
                    {form.qualitySpecs.map((item, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 40px', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          className="form-input"
                          placeholder="Chỉ tiêu (ví dụ: Đạm thô)"
                          value={item.indicator}
                          onChange={e => {
                            const updated = [...form.qualitySpecs];
                            updated[idx].indicator = e.target.value;
                            setForm({...form, qualitySpecs: updated});
                          }}
                        />
                        <input
                          className="form-input"
                          placeholder="Đơn vị (%)"
                          value={item.unit}
                          onChange={e => {
                            const updated = [...form.qualitySpecs];
                            updated[idx].unit = e.target.value;
                            setForm({...form, qualitySpecs: updated});
                          }}
                        />
                        <input
                          className="form-input"
                          placeholder="Giá trị (ví dụ: ≥ 30,0)"
                          value={item.value}
                          onChange={e => {
                            const updated = [...form.qualitySpecs];
                            updated[idx].value = e.target.value;
                            setForm({...form, qualitySpecs: updated});
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            const updated = form.qualitySpecs.filter((_, i) => i !== idx);
                            setForm({...form, qualitySpecs: updated.length ? updated : [{ indicator: '', unit: '', value: '' }]});
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Fallback Specs */}
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>Thông số nhanh (Quick Specs)</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Protein thô</label>
                        <input className="form-input" value={form.specs.protein || ''} onChange={e => setForm({...form, specs: {...form.specs, protein: e.target.value}})} placeholder="Ví dụ: ≥ 30%" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Độ ẩm</label>
                        <input className="form-input" value={form.specs.moisture || ''} onChange={e => setForm({...form, specs: {...form.specs, moisture: e.target.value}})} placeholder="Ví dụ: ≤ 12%" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Chất béo</label>
                        <input className="form-input" value={form.specs.fat || ''} onChange={e => setForm({...form, specs: {...form.specs, fat: e.target.value}})} placeholder="Ví dụ: ≤ 10%" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tro</label>
                        <input className="form-input" value={form.specs.ash || ''} onChange={e => setForm({...form, specs: {...form.specs, ash: e.target.value}})} placeholder="Ví dụ: ≤ 15%" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab Content: Packaging */}
              {activeTab === 'packaging' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Hướng dẫn sử dụng & Khuyến nghị tỷ lệ phối trộn</label>
                    <textarea className="form-textarea" rows="4" value={form.usage} onChange={e => setForm({...form, usage: e.target.value})} placeholder="Ví dụ:&#10;- Thức ăn gia súc: 3% - 5%&#10;- Thức ăn gia cầm: 2% - 4%&#10;- Thức ăn thủy sản: 3% - 8%" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lưu ý khi sử dụng</label>
                    <textarea className="form-textarea" rows="2" value={form.usageNote} onChange={e => setForm({...form, usageNote: e.target.value})} placeholder="Lưu ý về hàm lượng muối, bảo quản..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Quy cách bao bì</label>
                      <input className="form-input" value={form.packaging} onChange={e => setForm({...form, packaging: e.target.value})} placeholder="Ví dụ: Đóng bao PP có lót PE..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Trọng lượng đóng bao</label>
                      <input className="form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="Ví dụ: 50 kg/bao" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Điều kiện bảo quản</label>
                      <input className="form-input" value={form.storage} onChange={e => setForm({...form, storage: e.target.value})} placeholder="Ví dụ: Nơi khô ráo, thoáng mát..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hạn sử dụng</label>
                      <input className="form-input" value={form.shelfLife} onChange={e => setForm({...form, shelfLife: e.target.value})} placeholder="Ví dụ: 06 tháng kể từ ngày sản xuất" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tiêu chuẩn vận chuyển</label>
                    <textarea className="form-textarea" rows="2" value={form.shippingStandard} onChange={e => setForm({...form, shippingStandard: e.target.value})} placeholder="Phương tiện vận chuyển sạch sẽ, khô ráo..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cam kết chất lượng</label>
                    <textarea className="form-textarea" rows="2" value={form.qualityCommitment} onChange={e => setForm({...form, qualityCommitment: e.target.value})} placeholder="Đồng Tâm cam kết cung cấp sản phẩm có nguồn gốc rõ ràng..." />
                  </div>
                </>
              )}

              <div className="admin-modal-footer" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Mô tả ngắn</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const mainImg = (p.images && p.images.length > 0) ? p.images[0] : p.image;
              return (
                <tr key={p.id}>
                  <td>
                    {mainImg ? (
                      <img src={`${API}${mainImg}`} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.images && p.images.length > 1 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '6px', fontWeight: '500' }}>
                        ({p.images.length} ảnh)
                      </span>
                    )}
                  </td>
                  <td><span className="badge badge-green">{p.category}</span></td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.shortDesc || '—'}</td>
                  <td>{p.featured ? <span style={{ color: 'var(--green-600)', fontWeight: 'bold' }}>✓</span> : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>
                        <Edit3 size={14} /> Sửa
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <div className="admin-empty">Chưa có sản phẩm nào</div>}
      </div>
    </div>
  );
}
