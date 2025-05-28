import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import AdminRoutes from './routes/AdminRoutes';
import Login from './pages/admin/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; 
import Cookies from 'js-cookie';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Featured from './pages/Featured';
import Promotions from './pages/Promotions'
import ScrollToTop from './components/utils/ScrollToTop';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/validateToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authToken: token }),
          });

          if (response.ok) {
          } else {
            Cookies.remove('authToken');
          }
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="category" element={<Category />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="featured" element={<Featured />} />
          <Route path="promotions" element={<Promotions />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminRoutes /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
