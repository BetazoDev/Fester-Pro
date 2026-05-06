import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Promotores from './pages/admin/Promotores';
import Tiendas from './pages/admin/Tiendas';
import Catalogo from './pages/admin/Catalogo';
import Asistencia from './pages/admin/Asistencia';
import Excepciones from './pages/admin/Excepciones';
import Bonos from './pages/admin/Bonos';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/promotores" element={
        <ProtectedRoute roles={['supervisor', 'admin']}>
          <AppLayout><Promotores /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/tiendas" element={
        <ProtectedRoute roles={['supervisor', 'admin']}>
          <AppLayout><Tiendas /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/catalogo" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><Catalogo /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/asistencia" element={
        <ProtectedRoute>
          <AppLayout><Asistencia /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/excepciones" element={
        <ProtectedRoute roles={['supervisor', 'admin']}>
          <AppLayout><Excepciones /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/bonos" element={
        <ProtectedRoute roles={['supervisor', 'admin']}>
          <AppLayout><Bonos /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1c2030',
              color: '#f0f2f5',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#1c2030' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#1c2030' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
