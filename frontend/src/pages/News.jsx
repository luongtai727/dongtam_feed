import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowRight, Leaf, Calendar } from 'lucide-react';
import './News.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function News() {
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetch(`${API}/api/news/${slug}`)
        .then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.json();
        })
        .then(d => { setArticle(d); setLoading(false); })
        .catch(() => { setArticle(null); setLoading(false); });
    } else {
      setLoading(true);
      fetch(`${API}/api/news`)
        .then(r => r.json())
        .then(d => { setNewsList(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;

  // Single article not found
  if (slug && !article) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '8rem 0' }}>
        <h2>Không tìm thấy bài viết</h2>
        <Link to="/tin-tuc" className="btn btn-primary" style={{ marginTop: '1rem' }}>Quay lại tin tức</Link>
      </div>
    );
  }

  // Single article view
  if (slug && article) {
    return (
      <div className="news-page">
        <div className="page-header" style={{ padding: '5rem 0 2.5rem' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Trang chủ</Link>
              <ChevronRight size={14} />
              <Link to="/tin-tuc">Tin tức</Link>
              <ChevronRight size={14} />
              <span>{article.title}</span>
            </div>
          </div>
        </div>
        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="container">
            <div className="article-wrapper">
              <article className="article-content animate-fade-in-up" style={{ opacity: 0 }}>
                <div className="article-meta">
                  <span className="badge badge-green">{article.category}</span>
                  <span className="article-date"><Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <h1 className="article-title">{article.title}</h1>
                {article.image && (
                  <div className="article-image">
                    <img src={`${API}${article.image}`} alt={article.title} />
                  </div>
                )}
                <div className="article-body">
                  {article.content.split('\n').map((p, i) => (
                    p.trim() ? <p key={i}>{p}</p> : null
                  ))}
                </div>
              </article>
              <aside className="article-sidebar">
                <h3>Bài viết khác</h3>
                <div className="sidebar-articles">
                  {newsList.length === 0 && (
                    <SidebarLoader slug={slug} />
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // News List view
  return (
    <div className="news-page">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Tin tức</span>
          </div>
          <h1 className="page-title">Tin tức & Sự kiện</h1>
          <p className="page-desc">Cập nhật tin tức mới nhất về Đồng Tâm Feed và ngành chăn nuôi</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="news-list-grid">
            {newsList.map((item, i) => (
              <Link
                to={`/tin-tuc/${item.slug}`}
                className="news-list-card animate-fade-in-up"
                key={item.id}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="nlc-image">
                  {item.image ? (
                    <img src={`${API}${item.image}`} alt={item.title} />
                  ) : (
                    <div className="nlc-placeholder">
                      <Leaf size={36} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="nlc-body">
                  <div className="nlc-meta">
                    <span className="badge badge-green">{item.category}</span>
                    <span className="nlc-date">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="nlc-link">Đọc tiếp <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
          {newsList.length === 0 && (
            <div className="empty-state">
              <Leaf size={48} strokeWidth={1} />
              <h3>Chưa có tin tức</h3>
              <p>Hãy quay lại sau để xem tin tức mới nhất</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Small component to load sidebar articles
function SidebarLoader({ slug }) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API}/api/news`).then(r => r.json())
      .then(d => setArticles(d.filter(a => a.slug !== slug).slice(0, 5)))
      .catch(() => {});
  }, [slug]);

  return articles.map(a => (
    <Link to={`/tin-tuc/${a.slug}`} className="sidebar-article" key={a.id}>
      <h4>{a.title}</h4>
      <span>{new Date(a.createdAt).toLocaleDateString('vi-VN')}</span>
    </Link>
  ));
}
