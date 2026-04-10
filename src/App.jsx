import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ShopPage          from './pages/ShopPage';
import LoginPage         from './pages/LoginPage';
import DashboardPage     from './pages/DashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Storefront */}
          <Route path="/"             element={<ShopPage />} />

          {/* Auth */}
          <Route path="/admin/login"  element={<LoginPage />} />

          {/* Admin (protected) */}
          <Route path="/admin" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute><AdminProductsPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
