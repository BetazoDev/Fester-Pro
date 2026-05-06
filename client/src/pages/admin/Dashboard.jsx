import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineClipboardDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
  HiOutlineClock,
} from 'react-icons/hi2';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPromoters: 0,
    totalStores: 0,
    todayAttendance: 0,
    exceptions: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [usersRes, storesRes] = await Promise.all([
        api.get('/users?role=promotor&limit=1').catch(() => ({ data: { total: 0 } })),
        api.get('/stores').catch(() => ({ data: [] })),
      ]);

      setStats({
        totalPromoters: usersRes.data.total || 0,
        totalStores: Array.isArray(storesRes.data) ? storesRes.data.length : 0,
        todayAttendance: 0,
        exceptions: 0,
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = { admin: 'Administrador', supervisor: 'Supervisor', promotor: 'Promotor' };
    return labels[role] || role;
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="page-content fade-in">
        {/* Welcome */}
        <div className="page-header">
          <div>
            <h1>Bienvenido, {user?.name?.split(' ')[0]}</h1>
            <p>Panel de control — {getRoleLabel(user?.role)}</p>
          </div>
          <div className="badge badge-accent">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-accent)' }}>
            <div className="stat-icon accent">
              <HiOutlineUsers />
            </div>
            <div className="stat-content">
              <div className="stat-label">Promotores Activos</div>
              <div className="stat-value">{loading ? '—' : stats.totalPromoters}</div>
              <div className="stat-change positive">
                <HiOutlineArrowTrendingUp style={{ verticalAlign: 'middle' }} /> Equipo completo
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-accent': 'var(--color-info)' }}>
            <div className="stat-icon info">
              <HiOutlineBuildingStorefront />
            </div>
            <div className="stat-content">
              <div className="stat-label">Tiendas Registradas</div>
              <div className="stat-value">{loading ? '—' : stats.totalStores}</div>
              <div className="stat-change positive">Cobertura total</div>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-accent': 'var(--color-success)' }}>
            <div className="stat-icon success">
              <HiOutlineClipboardDocumentCheck />
            </div>
            <div className="stat-content">
              <div className="stat-label">Asistencia Hoy</div>
              <div className="stat-value">{loading ? '—' : stats.todayAttendance}</div>
              <div className="stat-change positive">
                <HiOutlineClock style={{ verticalAlign: 'middle' }} /> Tiempo real
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-accent': 'var(--color-warning)' }}>
            <div className="stat-icon warning">
              <HiOutlineExclamationTriangle />
            </div>
            <div className="stat-content">
              <div className="stat-label">Excepciones</div>
              <div className="stat-value">{loading ? '—' : stats.exceptions}</div>
              <div className="stat-change">Requieren atención</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Acciones Rápidas</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <a href="/promotores" className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }}>
                <HiOutlineUsers /> Gestionar Promotores
              </a>
              <a href="/tiendas" className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }}>
                <HiOutlineBuildingStorefront /> Ver Tiendas
              </a>
              <a href="/asistencia" className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }}>
                <HiOutlineClipboardDocumentCheck /> Revisar Asistencia
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Resumen del Sistema</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', lineHeight: 1.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Versión</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Estado</span>
                <span className="badge badge-success">Operativo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Plataforma</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>MERN Stack</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0' }}>
                <span>Último despliegue</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{new Date().toLocaleDateString('es-MX')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
