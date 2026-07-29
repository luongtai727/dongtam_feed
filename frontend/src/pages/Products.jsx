import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ChevronRight, Search, ChevronDown } from 'lucide-react';
import './Products.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/products`).then(r => r.json()),
      fetch(`${API}/api/categories?type=product`).then(r => r.json())
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
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Sản phẩm</span>
          </div>
          <h1 className="page-title">GIẢI PHÁP & SẢN PHẨM</h1>
          <p className="page-desc">Nguồn nguyên liệu thức ăn chăn nuôi & thủy sản chất lượng cao từ phụ phẩm sinh học</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {/* Filter Bar */}
          <div className="products-filter-bar">
            <div className="filter-categories-nav">
              <span className="filter-label">Nhóm sản phẩm:</span>
              {categories.map(cat => (
                <a key={cat.id} href={`#${cat.slug}`} className="vnf-cat-link" onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(cat.slug);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                  {cat.name}
                </a>
              ))}
            </div>
            <div className="filter-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="search-results-section">
              <h2 className="search-title">Kết quả tìm kiếm cho &ldquo;{search}&rdquo; ({searchResults.length})</h2>
              {searchResults.length > 0 ? (
                <div className="vnf-products-grid">
                  {searchResults.map(product => (
                    <Link to={`/san-pham/${product.slug}`} className="vnf-product-card" key={product.id}>
                      <div className="vnf-card-image-wrapper">
                        {product.image ? (
                          <img src={`${API}${product.image}`} alt={product.name} />
                        ) : (
                          <div className="vnf-card-placeholder">
                            <Leaf size={48} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div className="vnf-card-content">
                        <h3 className="vnf-card-name">{product.name}</h3>
                        <p className="vnf-card-desc">{product.shortDesc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Leaf size={48} strokeWidth={1} />
                  <h3>Không tìm thấy sản phẩm phù hợp</h3>
                  <p>Vui lòng kiểm tra lại từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          ) : (
            /* VNF Style Grouped Sections */
            <div className="vnf-groups-container">
              {categories.map(category => {
                const groupProducts = products.filter(p => p.category === category.name);
                if (groupProducts.length === 0) return null;
                return (
                  <div key={category.id} id={category.slug} className="vnf-group-section">
                    <div className="vnf-group-header">
                      <h2 className="vnf-group-title">{category.name}</h2>
                      {category.subtitle && (
                        <p className="vnf-group-subtitle">&ldquo;{category.subtitle}&rdquo;</p>
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
                              <img src={`${API}${product.image}`} alt={product.name} />
                            ) : (
                              <div className="vnf-card-placeholder">
                                <Leaf size={56} strokeWidth={1} />
                              </div>
                            )}
                          </div>
                          <div className="vnf-card-content">
                            <h3 className="vnf-card-name">{product.name}</h3>
                            <p className="vnf-card-desc">{product.shortDesc}</p>
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
