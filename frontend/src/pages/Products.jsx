import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Products.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Products() {
  const { t, tProduct, tCategory, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/products?_t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${API}/api/categories?type=product&_t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json())
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).catch(() => {});
  }, []);

  // Handle Hash Scroll
  useEffect(() => {
    if (location.hash && categories.length > 0) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location.hash, categories]);

  // Search
  const isSearching = search.trim().length > 0;
  const searchResults = isSearching
    ? products.filter(p =>
        tProduct(p, 'name').toLowerCase().includes(search.toLowerCase()) ||
        (tProduct(p, 'shortDesc') && tProduct(p, 'shortDesc').toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('productsPage.title')}</h1>
          <p className="page-desc">{t('productsPage.desc')}</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {/* Filter Bar */}
          <div className="products-filter-bar">
            <div className="filter-categories-nav">
              <span className="filter-label">{language === 'vi' ? 'Nhóm sản phẩm:' : language === 'en' ? 'Product Groups:' : '产品类别:'}</span>
              {categories.map(cat => (
                <a key={cat.id} href={`#${cat.slug}`} className="vnf-cat-link" onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(cat.slug);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                  {tCategory(cat.name)}
                </a>
              ))}
            </div>
            <div className="filter-search">
              <Search size={18} />
              <input
                type="text"
                placeholder={language === 'vi' ? 'Tìm kiếm sản phẩm...' : language === 'en' ? 'Search products...' : '搜索产品...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="search-results-section">
              <h2 className="search-title">
                {language === 'vi' ? `Kết quả tìm kiếm cho "${search}" (${searchResults.length})` :
                 language === 'en' ? `Search results for "${search}" (${searchResults.length})` :
                 `"${search}" 的搜索结果 (${searchResults.length})`}
              </h2>
              {searchResults.length > 0 ? (
                <div className="vnf-products-grid">
                  {searchResults.map(product => (
                    <Link to={`/san-pham/${product.slug}`} className="vnf-product-card" key={product.id}>
                      <div className="vnf-card-image-wrapper">
                        {product.image ? (
                          <img src={`${API}${product.image}`} alt={tProduct(product, 'name')} />
                        ) : (
                          <div className="vnf-card-placeholder">
                            <Leaf size={48} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div className="vnf-card-content">
                        <h3 className="vnf-card-name">{tProduct(product, 'name')}</h3>
                        <p className="vnf-card-desc">{tProduct(product, 'shortDesc')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Leaf size={48} strokeWidth={1} />
                  <h3>{language === 'vi' ? 'Không tìm thấy sản phẩm phù hợp' : language === 'en' ? 'No matching products found' : '未找到匹配的产品'}</h3>
                  <p>{language === 'vi' ? 'Vui lòng kiểm tra lại từ khóa tìm kiếm' : language === 'en' ? 'Please double check your keywords' : '请重新检查搜索关键词'}</p>
                </div>
              )}
            </div>
          ) : (
            /* VNF Style Grouped Sections */
            <div className="vnf-groups-container">
              {categories.map(category => {
                const groupProducts = products.filter(p => p.category === category.name);
                if (groupProducts.length === 0) return null;
                
                const getCategorySubtitle = (sub) => {
                  if (!sub) return '';
                  if (language === 'vi') return sub;
                  if (sub.includes('tăng trưởng')) return language === 'en' ? 'Sustainable growth solutions' : '可持续增长解决方案';
                  if (sub.includes('vượt trội')) return language === 'en' ? 'Premium quality, optimized cost' : '优质高品质，成本最优化';
                  if (sub.includes('đạm')) return language === 'en' ? 'Natural organic nitrogen source' : '天然有机氮源';
                  return sub;
                };

                return (
                  <div key={category.id} id={category.slug} className="vnf-group-section">
                    <div className="vnf-group-header">
                      <h2 className="vnf-group-title">{tCategory(category.name)}</h2>
                      {category.subtitle && (
                        <p className="vnf-group-subtitle">&ldquo;{getCategorySubtitle(category.subtitle)}&rdquo;</p>
                      )}
                      <div className="vnf-arrow-down">
                        <ChevronDown size={28} />
                      </div>
                    </div>
                    <div className="vnf-products-grid">
                      {groupProducts.map(product => (
                        <Link to={`/san-pham/${product.slug}`} className="vnf-product-card" key={product.id}>
                          <div className="vnf-card-image-wrapper">
                            {product.image ? (
                              <img src={`${API}${product.image}`} alt={tProduct(product, 'name')} />
                            ) : (
                              <div className="vnf-card-placeholder">
                                <Leaf size={56} strokeWidth={1} />
                              </div>
                            )}
                          </div>
                          <div className="vnf-card-content">
                            <h3 className="vnf-card-name">{tProduct(product, 'name')}</h3>
                            <p className="vnf-card-desc">{tProduct(product, 'shortDesc')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
