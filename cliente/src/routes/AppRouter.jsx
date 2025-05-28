import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Category from '../pages/Category';
import ProductDetail from '../pages/ProductDetail';
import CartSidebar from '../components/CartSidebar';
import { CartProvider } from '../contexts/CartContext';

const AppRouter = () => {
  return (
    <CartProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category" element={<Category />} />
          </Routes>
        </MainLayout>
        <CartSidebar />
      </Router>
    </CartProvider>
  );
};

export default AppRouter;
