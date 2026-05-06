import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineCube,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineExclamationTriangle,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi2';

const navItems = [
  { section: 'Principal' },
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { section: 'Gestión' },
  { path: '/promotores', label: 'Promotores', icon: HiOutlineUsers, roles: ['supervisor', 'admin'] },
  { path: '/tiendas', label: 'Tiendas', icon: HiOutlineBuildingStorefront, roles: ['supervisor', 'admin'] },
  { path: '/catalogo', label: 'Catálogo', icon: HiOutlineCube, roles: ['admin'] },
  { section: 'Operaciones' },
  { path: '/asistencia', label: 'Asistencia', icon: HiOutlineClipboardDocumentCheck },
  { path: '/excepciones', label: 'Excepciones', icon: HiOutlineExclamationTriangle, roles: ['supervisor', 'admin'] },
  { path: '/bonos', label: 'Bonificaciones', icon: HiOutlineCurrencyDollar, roles: ['supervisor', 'admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">F</div>
        <div className="sidebar-brand-text">
          <span>Fester</span> Pro
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="sidebar-section-title">
                {item.section}
              </div>
            );
          }

          // Role-based visibility
          if (item.roles && !item.roles.includes(user?.role)) {
            return null;
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-link-icon">
                <Icon />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">{user?.role}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Cerrar sesión">
          <HiOutlineArrowRightOnRectangle />
        </button>
      </div>
    </aside>
  );
}
