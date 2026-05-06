import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlinePencil, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function Promotores() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', mobile: '', city: '', role: 'promotor' });

  useEffect(() => { loadUsers(); }, [search]);

  const loadUsers = async () => {
    try {
      const { data } = await api.get(`/users?search=${search}&limit=50`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', phone: '', mobile: '', city: '', role: 'promotor' });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', phone: u.phone, mobile: u.mobile, city: u.city, role: u.role });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await api.put(`/users/${editUser._id}`, updateData);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/auth/register', form);
        toast.success('Usuario creado');
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const getRoleBadge = (role) => {
    const map = { admin: 'badge-danger', supervisor: 'badge-info', promotor: 'badge-accent' };
    const labels = { admin: 'Admin', supervisor: 'Supervisor', promotor: 'Promotor' };
    return <span className={`badge ${map[role]}`}>{labels[role]}</span>;
  };

  return (
    <>
      <Header title="Promotores" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>{total} usuarios registrados</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> Nuevo Usuario
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-search">
              <HiOutlineMagnifyingGlass className="table-search-icon" />
              <input
                placeholder="Buscar por nombre, correo o ciudad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-title">Sin usuarios</div>
              <p>Crea tu primer usuario para comenzar.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Ciudad</th>
                  <th>Rol</th>
                  <th>Tiendas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>{u.city || '—'}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{u.assignedStores?.length || 0}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>
                        <HiOutlinePencil />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineXMark /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nombre completo</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Correo</label>
                      <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{editUser ? 'Nueva contraseña' : 'Contraseña'}</label>
                      <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!editUser && { required: true })} placeholder={editUser ? 'Dejar vacío para no cambiar' : ''} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Celular</label>
                      <input className="form-input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ciudad</label>
                      <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rol</label>
                      <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        <option value="promotor">Promotor</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{editUser ? 'Guardar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
