import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Save, CheckCircle, Globe, ShoppingBag, Layout, Plus, Trash2 } from 'lucide-react';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || '';

export default function ManageTranslations() {
  const { token } = useAuth();
  const { setTranslations } = useLanguage();
  const [trans, setTrans] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedProduct, setSelectedProduct] = useState('bot-noi-tang-muc');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/translations`)
      .then(r => r.json())
      .then(setTrans)
      .catch(() => {});

    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProductsList(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(trans)
      });
      if (!res.ok) throw new Error('Failed');
      setSaved(true);
      setTranslations(trans); // Update context instantly
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Lỗi khi lưu bản dịch!');
    }
    setSaving(false);
  };

  if (!trans) {
    return <div className="loading-overlay"><div className="spinner"></div></div>;
  }

  // Update generic path e.g. updatePath('nav.home.en', 'Home')
  const updatePath = (pathString, val) => {
    setTrans(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = pathString.split('.');
      let temp = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!temp[parts[i]]) temp[parts[i]] = {};
        temp = temp[parts[i]];
      }
      temp[parts[parts.length - 1]] = val;
      return copy;
    });
  };

  const getProductData = () => {
    if (!trans.productsData || !trans.productsData[selectedProduct]) return null;
    return trans.productsData[selectedProduct];
  };

  const pData = getProductData();
  const rawProd = productsList.find(p => p.slug === selectedProduct || p.id === selectedProduct) || null;

  // Helper to add dynamic array row
  const addArrayItem = (fieldName, defaultItem) => {
    setTrans(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy.productsData[selectedProduct][fieldName]) {
        copy.productsData[selectedProduct][fieldName] = [];
      }
      copy.productsData[selectedProduct][fieldName].push(defaultItem);
      return copy;
    });
  };

  // Helper to remove dynamic array row
  const removeArrayItem = (fieldName, index) => {
    setTrans(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.productsData[selectedProduct][fieldName].splice(index, 1);
      return copy;
    });
  };

  // Helper to update array item properties
  const updateArrayItem = (fieldName, index, propName, lang, value) => {
    setTrans(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const arr = copy.productsData[selectedProduct][fieldName];
      if (lang) {
        if (!arr[index][propName]) arr[index][propName] = {};
        arr[index][propName][lang] = value;
      } else {
        arr[index][propName] = value;
      }
      return copy;
    });
  };

  // Helper to update string object item in array [{ vi, en, zh }]
  const updateLangArrayItem = (fieldName, index, lang, value) => {
    setTrans(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy.productsData[selectedProduct][fieldName]) {
        copy.productsData[selectedProduct][fieldName] = [];
      }
      const arr = copy.productsData[selectedProduct][fieldName];
      if (!arr[index]) arr[index] = { vi: '', en: '', zh: '' };
      if (typeof arr[index] === 'string') {
        arr[index] = { vi: arr[index], en: '', zh: '' };
      }
      arr[index][lang] = value;
      return copy;
    });
  };

  // Helper renderer for Tab 3 / B2B string fields
  const renderFieldWithViRef = (label, fieldKey, isTextarea = false, rows = 2) => {
    const rawVi = rawProd?.[fieldKey] || (typeof pData?.[fieldKey] === 'object' ? pData[fieldKey]?.vi : pData?.[fieldKey]) || '';
    const enVal = typeof pData?.[fieldKey] === 'object' ? (pData[fieldKey]?.en || '') : '';
    const zhVal = typeof pData?.[fieldKey] === 'object' ? (pData[fieldKey]?.zh || '') : '';

    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>{label}</label>
        
        {/* Read-only Vietnamese Reference Box */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.6rem', whiteSpace: 'pre-wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', display: 'block', marginBottom: '2px' }}>
            🇻🇳 Tiếng Việt (gốc từ Quản lý Sản phẩm):
          </span>
          {rawVi || '(Trống)'}
        </div>

        {/* Translation inputs for EN and ZH */}
        <div className="form-grid-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>🇬🇧 Tiếng Anh (EN):</span>
            {isTextarea ? (
              <textarea className="form-textarea" rows={rows} value={enVal} onChange={e => updatePath(`productsData.${selectedProduct}.${fieldKey}.en`, e.target.value)} placeholder="English translation..." />
            ) : (
              <input className="form-input" value={enVal} onChange={e => updatePath(`productsData.${selectedProduct}.${fieldKey}.en`, e.target.value)} placeholder="English translation..." />
            )}
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>🇨🇳 Tiếng Trung (ZH):</span>
            {isTextarea ? (
              <textarea className="form-textarea" rows={rows} value={zhVal} onChange={e => updatePath(`productsData.${selectedProduct}.${fieldKey}.zh`, e.target.value)} placeholder="中文翻译..." />
            ) : (
              <input className="form-input" value={zhVal} onChange={e => updatePath(`productsData.${selectedProduct}.${fieldKey}.zh`, e.target.value)} placeholder="中文翻译..." />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="translations-manager">
      <div className="admin-page-header">
        <div>
          <h1>Quản lý đa ngôn ngữ & Dịch thuật</h1>
          <p>Dịch toàn bộ văn bản giao diện, chỉ tiêu chất lượng, mô tả sản phẩm sang tiếng Anh và tiếng Trung trực quan</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {saved && (
            <div className="save-toast" style={{ margin: 0 }}>
              <CheckCircle size={16} /> Lưu thành công!
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu tất cả bản dịch'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1rem' }}>
        <button className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'general' ? '2px solid var(--green-500)' : 'none', color: activeTab === 'general' ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layout size={16} /> Dịch tĩnh Giao diện
        </button>
        <button className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'products' ? '2px solid var(--green-500)' : 'none', color: activeTab === 'products' ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={16} /> Dịch sản phẩm B2B
        </button>
      </div>

      {/* TAB 1: GENERAL TRANSLATIONS */}
      {activeTab === 'general' && (
        <div className="settings-form">
          {/* Section: Navbar */}
          <div className="settings-section">
            <h3>Menu điều hướng (Navbar)</h3>
            <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Trang chủ (VI)</label>
                <input className="form-input" value={trans.nav?.home?.vi || ''} onChange={e => updatePath('nav.home.vi', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Trang chủ (EN)</label>
                <input className="form-input" value={trans.nav?.home?.en || ''} onChange={e => updatePath('nav.home.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Trang chủ (ZH)</label>
                <input className="form-input" value={trans.nav?.home?.zh || ''} onChange={e => updatePath('nav.home.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Giới thiệu (VI)</label>
                <input className="form-input" value={trans.nav?.about?.vi || ''} onChange={e => updatePath('nav.about.vi', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Giới thiệu (EN)</label>
                <input className="form-input" value={trans.nav?.about?.en || ''} onChange={e => updatePath('nav.about.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Giới thiệu (ZH)</label>
                <input className="form-input" value={trans.nav?.about?.zh || ''} onChange={e => updatePath('nav.about.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Sản phẩm (VI)</label>
                <input className="form-input" value={trans.nav?.products?.vi || ''} onChange={e => updatePath('nav.products.vi', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Sản phẩm (EN)</label>
                <input className="form-input" value={trans.nav?.products?.en || ''} onChange={e => updatePath('nav.products.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Sản phẩm (ZH)</label>
                <input className="form-input" value={trans.nav?.products?.zh || ''} onChange={e => updatePath('nav.products.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Tin tức (VI)</label>
                <input className="form-input" value={trans.nav?.news?.vi || ''} onChange={e => updatePath('nav.news.vi', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tin tức (EN)</label>
                <input className="form-input" value={trans.nav?.news?.en || ''} onChange={e => updatePath('nav.news.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tin tức (ZH)</label>
                <input className="form-input" value={trans.nav?.news?.zh || ''} onChange={e => updatePath('nav.news.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Liên hệ (VI)</label>
                <input className="form-input" value={trans.nav?.contact?.vi || ''} onChange={e => updatePath('nav.contact.vi', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Liên hệ (EN)</label>
                <input className="form-input" value={trans.nav?.contact?.en || ''} onChange={e => updatePath('nav.contact.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Liên hệ (ZH)</label>
                <input className="form-input" value={trans.nav?.contact?.zh || ''} onChange={e => updatePath('nav.contact.zh', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section: Hero Banner */}
          <div className="settings-section">
            <h3>Nội dung biểu ngữ Trang chủ (Hero Banner)</h3>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Tiêu đề chính (VI) - Dòng 1</label>
              <input className="form-input" value={trans.hero?.titleMain?.vi || ''} onChange={e => updatePath('hero.titleMain.vi', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tiêu đề chính (EN) - Dòng 1</label>
                <input className="form-input" value={trans.hero?.titleMain?.en || ''} onChange={e => updatePath('hero.titleMain.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề chính (ZH) - Dòng 1</label>
                <input className="form-input" value={trans.hero?.titleMain?.zh || ''} onChange={e => updatePath('hero.titleMain.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Tiêu đề phụ (VI) - Dòng 2</label>
              <input className="form-input" value={trans.hero?.titleSub?.vi || ''} onChange={e => updatePath('hero.titleSub.vi', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tiêu đề phụ (EN) - Dòng 2</label>
                <input className="form-input" value={trans.hero?.titleSub?.en || ''} onChange={e => updatePath('hero.titleSub.en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề phụ (ZH) - Dòng 2</label>
                <input className="form-input" value={trans.hero?.titleSub?.zh || ''} onChange={e => updatePath('hero.titleSub.zh', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả tổng quan (VI)</label>
              <textarea className="form-textarea" rows="3" value={trans.hero?.desc?.vi || ''} onChange={e => updatePath('hero.desc.vi', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả tổng quan (EN)</label>
              <textarea className="form-textarea" rows="3" value={trans.hero?.desc?.en || ''} onChange={e => updatePath('hero.desc.en', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả tổng quan (ZH)</label>
              <textarea className="form-textarea" rows="3" value={trans.hero?.desc?.zh || ''} onChange={e => updatePath('hero.desc.zh', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT TRANSLATIONS (EN & ZH focus, VI read-only reference) */}
      {activeTab === 'products' && (
        <div className="product-translations-form">
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe size={22} style={{ color: '#16a34a', flexShrink: 0 }} />
            <div>
              <strong>Chế độ Dịch B2B Tiếng Anh & Tiếng Trung:</strong> Nội dung <strong>Tiếng Việt (VI)</strong> được tự động tham chiếu từ mục <em>Quản lý Sản phẩm</em>. Bạn chỉ cần nhập dịch sang <strong>Tiếng Anh (EN)</strong> và <strong>Tiếng Trung (ZH)</strong> mà không cần sửa lại tiếng Việt.
            </div>
          </div>

          <div className="settings-section" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Chọn sản phẩm cần dịch:</label>
            <select className="form-input" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ width: '320px', fontWeight: 600 }}>
              {Object.keys(trans.productsData || {}).map(slug => {
                const match = productsList.find(p => p.slug === slug || p.id === slug);
                const labelName = match?.name || trans.productsData[slug]?.name?.vi || slug;
                return (
                  <option key={slug} value={slug}>
                    {labelName}
                  </option>
                );
              })}
            </select>
          </div>

          {pData ? (
            <div className="settings-form">
              {/* Product Basic Name & Category */}
              <div className="settings-section">
                <h3>1. Tên & Nhóm sản phẩm</h3>
                {renderFieldWithViRef('Tên sản phẩm', 'name', false)}
                {renderFieldWithViRef('Danh mục sản phẩm', 'category', false)}
              </div>

              {/* Descriptions & Ingredients */}
              <div className="settings-section">
                <h3>2. Mô tả & Chi tiết</h3>
                {renderFieldWithViRef('Mô tả ngắn (Short Description)', 'shortDesc', true, 2)}
                {renderFieldWithViRef('Mô tả chi tiết (Detailed Description)', 'description', true, 3)}
                {renderFieldWithViRef('Thành phần nguyên liệu (Ingredients)', 'ingredients', false)}
              </div>

              {/* Ưu điểm nổi bật */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>3. Ưu điểm nổi bật (Key Highlights)</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('highlights', { vi: '', en: '', zh: '' })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm ưu điểm
                  </button>
                </div>
                {(pData.highlights || []).map((item, index) => {
                  const rawVi = rawProd?.highlights?.[index] || (typeof item === 'object' ? item?.vi : item) || '';
                  const enVal = typeof item === 'object' ? (item?.en || '') : '';
                  const zhVal = typeof item === 'object' ? (item?.zh || '') : '';
                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rawVi}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0284c7', display: 'block' }}>VI (gốc):</span>
                        {rawVi || '(Trống)'}
                      </div>
                      <input className="form-input" value={enVal} onChange={e => updateLangArrayItem('highlights', index, 'en', e.target.value)} placeholder="Highlight EN..." />
                      <input className="form-input" value={zhVal} onChange={e => updateLangArrayItem('highlights', index, 'zh', e.target.value)} placeholder="优势 ZH..." />
                      <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('highlights', index)} style={{ justifySelf: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Công dụng */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>4. Công dụng (Product Application)</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('uses', { vi: '', en: '', zh: '' })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm công dụng
                  </button>
                </div>
                {(pData.uses || []).map((item, index) => {
                  const rawVi = rawProd?.uses?.[index] || (typeof item === 'object' ? item?.vi : item) || '';
                  const enVal = typeof item === 'object' ? (item?.en || '') : '';
                  const zhVal = typeof item === 'object' ? (item?.zh || '') : '';
                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rawVi}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0284c7', display: 'block' }}>VI (gốc):</span>
                        {rawVi || '(Trống)'}
                      </div>
                      <input className="form-input" value={enVal} onChange={e => updateLangArrayItem('uses', index, 'en', e.target.value)} placeholder="Use EN..." />
                      <input className="form-input" value={zhVal} onChange={e => updateLangArrayItem('uses', index, 'zh', e.target.value)} placeholder="功效 ZH..." />
                      <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('uses', index)} style={{ justifySelf: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Đối tượng sử dụng */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>5. Đối tượng sử dụng (Target Species)</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('targets', { vi: '', en: '', zh: '' })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm đối tượng
                  </button>
                </div>
                {(pData.targets || []).map((item, index) => {
                  const rawVi = rawProd?.targets?.[index] || (typeof item === 'object' ? item?.vi : item) || '';
                  const enVal = typeof item === 'object' ? (item?.en || '') : '';
                  const zhVal = typeof item === 'object' ? (item?.zh || '') : '';
                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rawVi}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0284c7', display: 'block' }}>VI (gốc):</span>
                        {rawVi || '(Trống)'}
                      </div>
                      <input className="form-input" value={enVal} onChange={e => updateLangArrayItem('targets', index, 'en', e.target.value)} placeholder="Target EN..." />
                      <input className="form-input" value={zhVal} onChange={e => updateLangArrayItem('targets', index, 'zh', e.target.value)} placeholder="适用对象 ZH..." />
                      <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('targets', index)} style={{ justifySelf: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quality Specifications */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>6. Chỉ tiêu chất lượng (Lý hóa)</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('qualitySpecs', { indicator: { vi: 'Chỉ tiêu mới', en: 'New indicator', zh: '新指标' }, unit: '%', value: '10' })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm chỉ tiêu chất lượng
                  </button>
                </div>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Chỉ tiêu VI (Gốc)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tên EN</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tên ZH</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', width: '90px' }}>Đơn vị</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', width: '120px' }}>Giá trị</th>
                      <th style={{ padding: '0.5rem', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pData.qualitySpecs || []).map((spec, index) => {
                      const rawSpec = rawProd?.qualitySpecs?.[index];
                      const viInd = rawSpec?.indicator || spec.indicator?.vi || '';
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.5rem' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                              {viInd || '(Trống)'}
                            </div>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.indicator?.en || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'indicator', 'en', e.target.value)} placeholder="Name EN" />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.indicator?.zh || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'indicator', 'zh', e.target.value)} placeholder="Name ZH" />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.unit || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'unit', null, e.target.value)} />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.value || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'value', null, e.target.value)} />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                            <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('qualitySpecs', index)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sensory Specifications */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>7. Chỉ tiêu cảm quan</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('sensorySpecs', { indicator: { vi: 'Màu sắc', en: 'Color', zh: '颜色' }, requirement: { vi: 'Nâu nhạt', en: 'Light brown', zh: '浅褐色' } })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm chỉ tiêu cảm quan
                  </button>
                </div>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Chỉ tiêu VI (Gốc)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tên EN</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tên ZH</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Yêu cầu VI (Gốc)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Yêu cầu EN</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Yêu cầu ZH</th>
                      <th style={{ padding: '0.5rem', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pData.sensorySpecs || []).map((spec, index) => {
                      const rawSpec = rawProd?.sensorySpecs?.[index];
                      const viInd = rawSpec?.indicator || spec.indicator?.vi || '';
                      const viReq = rawSpec?.requirement || spec.requirement?.vi || '';
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.5rem' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                              {viInd || '(Trống)'}
                            </div>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.indicator?.en || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'indicator', 'en', e.target.value)} placeholder="EN" />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.indicator?.zh || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'indicator', 'zh', e.target.value)} placeholder="ZH" />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', color: '#1e293b' }}>
                              {viReq || '(Trống)'}
                            </div>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.requirement?.en || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'requirement', 'en', e.target.value)} placeholder="Requirement EN" />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input className="form-input" value={spec.requirement?.zh || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'requirement', 'zh', e.target.value)} placeholder="Yêu cầu ZH" />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                            <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('sensorySpecs', index)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tab 3: HD sử dụng, Đóng gói & Vận chuyển */}
              <div className="settings-section">
                <h3>8. Thông số HD sử dụng, Đóng gói & Vận chuyển</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Xem nội dung Tiếng Việt gốc và nhập dịch sang Tiếng Anh & Tiếng Trung
                </p>

                {renderFieldWithViRef('1. HD sử dụng & Khuyến nghị tỷ lệ phối trộn (Usage Instructions)', 'usage', true, 3)}
                {renderFieldWithViRef('2. Lưu ý khi sử dụng (Usage Note)', 'usageNote', false)}
                {renderFieldWithViRef('3. Quy cách bao bì (Packaging Spec)', 'packaging', false)}
                {renderFieldWithViRef('4. Trọng lượng đóng bao (Bag Weight)', 'weight', false)}
                {renderFieldWithViRef('5. Điều kiện bảo quản (Storage Conditions)', 'storage', false)}
                {renderFieldWithViRef('6. Hạn sử dụng (Shelf Life)', 'shelfLife', false)}
                {renderFieldWithViRef('7. Tiêu chuẩn vận chuyển (Transportation Standard)', 'shippingStandard', true, 2)}
                {renderFieldWithViRef('8. Cam kết chất lượng từ Đồng Tâm (Quality Commitment)', 'qualityCommitment', true, 2)}
              </div>
            </div>
          ) : (
            <p>Không có dữ liệu dịch cho sản phẩm này.</p>
          )}
        </div>
      )}
    </div>
  );
}
