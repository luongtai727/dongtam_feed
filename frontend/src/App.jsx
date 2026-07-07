import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import News from './pages/News';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageNews from './pages/admin/ManageNews';
import ManageContacts from './pages/admin/ManageContacts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageSettings from './pages/admin/ManageSettings';
import ManageGallery from './pages/admin/ManageGallery';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

// Layout for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/gioi-thieu/:section" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/san-pham" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/san-pham/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/tin-tuc" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/tin-tuc/:slug" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/lien-he" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        }>
          <Route path="products" element={<ManageProducts />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="settings" element={<ManageSettings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
