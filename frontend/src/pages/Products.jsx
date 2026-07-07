import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, ChevronRight, Search } from 'lucide-react';
import './Products.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/api/products`).then(r => r.json()).then(d => {
      setProducts(d);
      setFiltered(d);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeCategory, search, products]);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const categoryLabels = { all: 'Tất cả' };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Sản phẩm</span>
          </div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-desc">Các dòng nguyên liệu thức ăn chăn nuôi chất lượng cao từ phụ phẩm thủy sản</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="products-filter-bar">
            <div className="filter-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {categoryLabels[cat] || cat}
                </button>
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

          {/* Products Grid */}
          <div className="products-list-grid">
            {filtered.map((product, i) => (
              <Link
                to={`/san-pham/${product.slug}`}
                className="product-list-card animate-fade-in-up"
                key={product.id}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="plc-image">
                  {product.image ? (
                    <img src={`${API}${product.image}`} alt={product.name} />
                  ) : (
                    <div className="plc-placeholder">
                      <Leaf size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="plc-overlay">
                    <span className="btn btn-white btn-sm">Xem chi tiết</span>
                  </div>
                </div>
                <div className="plc-body">
                  <span className="card-tag">{product.category}</span>
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-text">{product.shortDesc}</p>
                  <div className="plc-footer">
                    <span className="plc-link">
                      Chi tiết <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Leaf size={48} strokeWidth={1} />
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
