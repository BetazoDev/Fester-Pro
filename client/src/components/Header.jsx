import { useAuth } from '../context/AuthContext';
import { HiOutlineBell } from 'react-icons/hi2';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        <button className="btn btn-ghost btn-sm">
          <HiOutlineBell />
        </button>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {user?.email}
        </span>
      </div>
    </header>
  );
}
