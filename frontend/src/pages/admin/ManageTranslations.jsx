import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Save, CheckCircle, Globe, ShoppingBag, Layout, Plus, Trash2 } from 'lucide-react';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ManageTranslations() {
  const { token } = useAuth();
  const { setTranslations } = useLanguage();
  const [trans, setTrans] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedProduct, setSelectedProduct] = useState('bot-noi-tang-muc');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/translations`)
      .then(r => r.json())
      .then(setTrans)
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

  // Helper to add dynamic array row (highlights, sensorySpecs, qualitySpecs)
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

      {/* TAB 2: PRODUCT TRANSLATIONS */}
      {activeTab === 'products' && (
        <div className="product-translations-form">
          <div className="settings-section" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Chọn sản phẩm cần dịch:</label>
            <select className="form-input" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ width: '300px' }}>
              {Object.keys(trans.productsData || {}).map(slug => (
                <option key={slug} value={slug}>
                  {trans.productsData[slug]?.name?.vi || slug}
                </option>
              ))}
            </select>
          </div>

          {pData ? (
            <div className="settings-form">
              {/* Product Basic Name & Category */}
              <div className="settings-section">
                <h3>Tên & Nhóm sản phẩm</h3>
                <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tên Tiếng Việt</label>
                    <input className="form-input" value={pData.name?.vi || ''} onChange={e => updatePath(`productsData.${selectedProduct}.name.vi`, e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên Tiếng Anh</label>
                    <input className="form-input" value={pData.name?.en || ''} onChange={e => updatePath(`productsData.${selectedProduct}.name.en`, e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên Tiếng Trung</label>
                    <input className="form-input" value={pData.name?.zh || ''} onChange={e => updatePath(`productsData.${selectedProduct}.name.zh`, e.target.value)} />
                  </div>
                </div>
                <div className="form-grid-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục (VI)</label>
                    <input className="form-input" value={pData.category?.vi || ''} onChange={e => updatePath(`productsData.${selectedProduct}.category.vi`, e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Danh mục (EN)</label>
                    <input className="form-input" value={pData.category?.en || ''} onChange={e => updatePath(`productsData.${selectedProduct}.category.en`, e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Danh mục (ZH)</label>
                    <input className="form-input" value={pData.category?.zh || ''} onChange={e => updatePath(`productsData.${selectedProduct}.category.zh`, e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Descriptions & Ingredients */}
              <div className="settings-section">
                <h3>Mô tả & Chi tiết</h3>
                <div className="form-group">
                  <label className="form-label">Mô tả ngắn (VI)</label>
                  <input className="form-input" value={pData.shortDesc?.vi || ''} onChange={e => updatePath(`productsData.${selectedProduct}.shortDesc.vi`, e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả ngắn (EN)</label>
                  <input className="form-input" value={pData.shortDesc?.en || ''} onChange={e => updatePath(`productsData.${selectedProduct}.shortDesc.en`, e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Mô tả ngắn (ZH)</label>
                  <input className="form-input" value={pData.shortDesc?.zh || ''} onChange={e => updatePath(`productsData.${selectedProduct}.shortDesc.zh`, e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết (VI)</label>
                  <textarea className="form-textarea" rows="3" value={pData.description?.vi || ''} onChange={e => updatePath(`productsData.${selectedProduct}.description.vi`, e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết (EN)</label>
                  <textarea className="form-textarea" rows="3" value={pData.description?.en || ''} onChange={e => updatePath(`productsData.${selectedProduct}.description.en`, e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Mô tả chi tiết (ZH)</label>
                  <textarea className="form-textarea" rows="3" value={pData.description?.zh || ''} onChange={e => updatePath(`productsData.${selectedProduct}.description.zh`, e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Thành phần nguyên liệu (VI)</label>
                  <input className="form-input" value={pData.ingredients?.vi || ''} onChange={e => updatePath(`productsData.${selectedProduct}.ingredients.vi`, e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Thành phần nguyên liệu (EN)</label>
                  <input className="form-input" value={pData.ingredients?.en || ''} onChange={e => updatePath(`productsData.${selectedProduct}.ingredients.en`, e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Thành phần nguyên liệu (ZH)</label>
                  <input className="form-input" value={pData.ingredients?.zh || ''} onChange={e => updatePath(`productsData.${selectedProduct}.ingredients.zh`, e.target.value)} />
                </div>
              </div>

              {/* Quality Specifications */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Chỉ tiêu chất lượng (Lý hóa)</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('qualitySpecs', { indicator: { vi: 'Chỉ tiêu mới', en: 'New indicator', zh: '新指标' }, unit: '%', value: '10' })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm chỉ tiêu chất lượng
                  </button>
                </div>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Chỉ tiêu (VI - EN - ZH)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', width: '120px' }}>Đơn vị</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Mức yêu cầu / Giá trị</th>
                      <th style={{ padding: '0.5rem', width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pData.qualitySpecs || []).map((spec, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.5rem' }}>
                          <input className="form-input" value={spec.indicator?.vi || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'indicator', 'vi', e.target.value)} placeholder="Tên VI" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.indicator?.en || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'indicator', 'en', e.target.value)} placeholder="Tên EN" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.indicator?.zh || ''} onChange={e => updateArrayItem('qualitySpecs', index, 'indicator', 'zh', e.target.value)} placeholder="Tên ZH" />
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
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sensory Specifications */}
              <div className="settings-section">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Chỉ tiêu cảm quan</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('sensorySpecs', { indicator: { vi: 'Màu sắc', en: 'Color', zh: '颜色' }, requirement: { vi: 'Nâu nhạt', en: 'Light brown', zh: '浅褐色' } })} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Thêm chỉ tiêu cảm quan
                  </button>
                </div>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Chỉ tiêu cảm quan (VI - EN - ZH)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Yêu cầu cảm quan (VI - EN - ZH)</th>
                      <th style={{ padding: '0.5rem', width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pData.sensorySpecs || []).map((spec, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.5rem' }}>
                          <input className="form-input" value={spec.indicator?.vi || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'indicator', 'vi', e.target.value)} placeholder="VI" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.indicator?.en || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'indicator', 'en', e.target.value)} placeholder="EN" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.indicator?.zh || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'indicator', 'zh', e.target.value)} placeholder="ZH" />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input className="form-input" value={spec.requirement?.vi || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'requirement', 'vi', e.target.value)} placeholder="Yêu cầu VI" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.requirement?.en || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'requirement', 'en', e.target.value)} placeholder="Yêu cầu EN" style={{ marginBottom: '0.25rem' }} />
                          <input className="form-input" value={spec.requirement?.zh || ''} onChange={e => updateArrayItem('sensorySpecs', index, 'requirement', 'zh', e.target.value)} placeholder="Yêu cầu ZH" />
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <button type="button" className="btn-icon text-red" onClick={() => removeArrayItem('sensorySpecs', index)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
