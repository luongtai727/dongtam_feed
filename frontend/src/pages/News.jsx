import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowRight, Leaf, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './News.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function News() {
  const { t, tNews, language } = useLanguage();
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
        <h2>{language === 'vi' ? 'Không tìm thấy bài viết' : language === 'en' ? 'Article not found' : '未找到文章'}</h2>
        <Link to="/tin-tuc" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {language === 'vi' ? 'Quay lại tin tức' : language === 'en' ? 'Back to news' : '返回新闻'}
        </Link>
      </div>
    );
  }

  // Single article view
  if (slug && article) {
    const getArticleContent = (art) => {
      if (language === 'vi') return art.content;
      if (language === 'en') {
        if (art.title.includes('Bột nội tạng mực')) {
          return "Dong Tam Feed Solutions is proud to announce the activation of our brand-new industrial production line dedicated to Deep Sea Squid Viscera Powder.\nEquipped with cutting-edge industrial processing technologies, the line will deliver 50 tons per day of premium, high-protein marine feed ingredients to national and international aquaculture partners.\nThis milestone marks our dedication to sustainable circular economy practices in agriculture.";
        }
        return `This article is currently only available in Vietnamese: \n\n${art.content}`;
      }
      if (language === 'zh') {
        if (art.title.includes('Bột nội tạng mực')) {
          return "同心饲料营养解决方案有限公司自豪地宣布，我们专门用于深海鱿鱼内脏粉的新型工业生产线已正式启用。\n该生产线引进了先进的加工技术，每日可向国内外水产养殖合作伙伴提供50吨优质高蛋白海洋饲料原料。\n这一里程碑标志着我们在农业领域致力于可持续循环经济的决心。";
        }
        return `本文目前仅提供越南语版本：\n\n${art.content}`;
      }
      return art.content;
    };

    return (
      <div className="news-page">
        <div className="page-header" style={{ padding: '5rem 0 2.5rem' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">{t('nav.home')}</Link>
              <ChevronRight size={14} />
              <Link to="/tin-tuc">{t('nav.news')}</Link>
              <ChevronRight size={14} />
              <span>{tNews(article, 'title')}</span>
            </div>
          </div>
        </div>
        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="container">
            <div className="article-wrapper">
              <article className="article-content animate-fade-in-up" style={{ opacity: 0 }}>
                <div className="article-meta">
                  <span className="badge badge-green">{language === 'vi' ? article.category : language === 'en' ? 'News' : '新闻'}</span>
                  <span className="article-date">
                    <Calendar size={14} /> 
                    {new Date(article.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'zh-CN')}
                  </span>
                </div>
                <h1 className="article-title">{tNews(article, 'title')}</h1>
                {article.image && (
                  <div className="article-image">
                    <img src={`${API}${article.image}`} alt={tNews(article, 'title')} />
                  </div>
                )}
                <div className="article-body">
                  {getArticleContent(article).split('\n').map((p, i) => (
                    p.trim() ? <p key={i}>{p}</p> : null
                  ))}
                </div>
              </article>
              <aside className="article-sidebar">
                <h3>{language === 'vi' ? 'Bài viết khác' : language === 'en' ? 'Other Articles' : '其他文章'}</h3>
                <div className="sidebar-articles">
                  <SidebarLoader slug={slug} tNews={tNews} language={language} />
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
            <Link to="/">{t('nav.home')}</Link>
            <ChevronRight size={14} />
            <span>{t('nav.news')}</span>
          </div>
          <h1 className="page-title">{t('newsSection.title')}</h1>
          <p className="page-desc">{t('newsSection.desc')}</p>
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
                    <img src={`${API}${item.image}`} alt={tNews(item, 'title')} />
                  ) : (
                    <div className="nlc-placeholder">
                      <Leaf size={36} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="nlc-body">
                  <div className="nlc-meta">
                    <span className="badge badge-green">{language === 'vi' ? item.category : language === 'en' ? 'News' : '新闻'}</span>
                    <span className="nlc-date">
                      {new Date(item.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'zh-CN')}
                    </span>
                  </div>
                  <h3>{tNews(item, 'title')}</h3>
                  <p>{tNews(item, 'summary')}</p>
                  <span className="nlc-link">{t('newsSection.readMore')} <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
          {newsList.length === 0 && (
            <div className="empty-state">
              <Leaf size={48} strokeWidth={1} />
              <h3>{language === 'vi' ? 'Chưa có tin tức' : language === 'en' ? 'No articles posted yet' : '暂无新闻公告'}</h3>
              <p>{language === 'vi' ? 'Hãy quay lại sau để xem tin tức mới nhất' : language === 'en' ? 'Please check back later for the latest updates' : '请稍后再回来查看最新消息'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Small component to load sidebar articles
function SidebarLoader({ slug, tNews, language }) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API}/api/news`).then(r => r.json())
      .then(d => setArticles(d.filter(a => a.slug !== slug).slice(0, 5)))
      .catch(() => {});
  }, [slug]);

  return articles.map(a => (
    <Link to={`/tin-tuc/${a.slug}`} className="sidebar-article" key={a.id}>
      <h4>{tNews(a, 'title')}</h4>
      <span>{new Date(a.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'zh-CN')}</span>
    </Link>
  ));
}
