import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Newspaper, MessageSquare, Settings,
  LogOut, Leaf, ChevronRight, Menu, X, BarChart3, Users, TrendingUp, Tag
} from 'lucide-react';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalProducts: 0, totalNews: 0, totalContacts: 0, newContacts: 0 });

  useEffect(() => {
    fetch(`${API}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, [token, location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { path: '/admin/products', label: 'Sản phẩm', icon: <Package size={18} /> },
    { path: '/admin/news', label: 'Tin tức', icon: <Newspaper size={18} /> },
    { path: '/admin/categories', label: 'Danh mục', icon: <Tag size={18} /> },
    { path: '/admin/contacts', label: 'Liên hệ', icon: <MessageSquare size={18} />, badge: stats.newContacts },
    { path: '/admin/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const isDashboardHome = location.pathname === '/admin';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            <div className="admin-logo-sm"><Leaf size={20} /></div>
            <span>Admin Panel</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item" target="_blank">
            <Leaf size={18} />
            <span>Xem website</span>
          </Link>
          <button className="admin-nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="admin-header-info">
            <span className="admin-greeting">Xin chào, <strong>{user?.username || 'Admin'}</strong></span>
          </div>
        </header>

        <div className="admin-content">
          {isDashboardHome ? (
            <div className="dashboard-home">
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-desc">Tổng quan hệ thống quản trị Đồng Tâm Feed</p>

              <div className="dashboard-stats">
                <div className="dash-stat-card green">
                  <div className="dsc-icon"><Package size={24} /></div>
                  <div className="dsc-info">
                    <div className="dsc-number">{stats.totalProducts}</div>
                    <div className="dsc-label">Sản phẩm</div>
                  </div>
                </div>
                <div className="dash-stat-card navy">
                  <div className="dsc-icon"><Newspaper size={24} /></div>
                  <div className="dsc-info">
                    <div className="dsc-number">{stats.totalNews}</div>
                    <div className="dsc-label">Bài viết</div>
                  </div>
                </div>
                <div className="dash-stat-card gold">
                  <div className="dsc-icon"><MessageSquare size={24} /></div>
                  <div className="dsc-info">
                    <div className="dsc-number">{stats.totalContacts}</div>
                    <div className="dsc-label">Tổng liên hệ</div>
                  </div>
                </div>
                <div className="dash-stat-card orange">
                  <div className="dsc-icon"><Users size={24} /></div>
                  <div className="dsc-info">
                    <div className="dsc-number">{stats.newContacts}</div>
                    <div className="dsc-label">Liên hệ mới</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-actions">
                <Link to="/admin/products" className="dash-action-card">
                  <Package size={24} />
                  <h3>Quản lý Sản phẩm</h3>
                  <p>Thêm, sửa, xóa sản phẩm</p>
                  <ChevronRight size={18} />
                </Link>
                <Link to="/admin/news" className="dash-action-card">
                  <Newspaper size={24} />
                  <h3>Quản lý Tin tức</h3>
                  <p>Viết và quản lý bài viết</p>
                  <ChevronRight size={18} />
                </Link>
                <Link to="/admin/contacts" className="dash-action-card">
                  <MessageSquare size={24} />
                  <h3>Xem Liên hệ</h3>
                  <p>Xem yêu cầu từ khách hàng</p>
                  <ChevronRight size={18} />
                </Link>
                <Link to="/admin/settings" className="dash-action-card">
                  <Settings size={24} />
                  <h3>Cài đặt chung</h3>
                  <p>Cập nhật thông tin công ty</p>
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}
