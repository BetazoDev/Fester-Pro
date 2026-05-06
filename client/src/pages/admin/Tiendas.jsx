import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlinePencil, HiOutlineXMark, HiOutlineMapPin } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function Tiendas() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStore, setEditStore] = useState(null);
  const [form, setForm] = useState({
    name: '', chain: 'Home Depot', address: '', city: '', state: '',
    coordinates: { lat: '', lng: '' }, geofenceRadius: 200,
  });

  useEffect(() => { loadStores(); }, [search]);

  const loadStores = async () => {
    try {
      const { data } = await api.get(`/stores?search=${search}`);
      setStores(data);
    } catch (err) {
      toast.error('Error al cargar tiendas');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditStore(null);
    setForm({ name: '', chain: 'Home Depot', address: '', city: '', state: '', coordinates: { lat: '', lng: '' }, geofenceRadius: 200 });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStore(s);
    setForm({
      name: s.name, chain: s.chain, address: s.address, city: s.city,
      state: s.state || '', coordinates: { lat: s.coordinates.lat, lng: s.coordinates.lng },
      geofenceRadius: s.geofenceRadius,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      coordinates: { lat: parseFloat(form.coordinates.lat), lng: parseFloat(form.coordinates.lng) },
      geofenceRadius: parseInt(form.geofenceRadius),
    };

    try {
      if (editStore) {
        await api.put(`/stores/${editStore._id}`, payload);
        toast.success('Tienda actualizada');
      } else {
        await api.post('/stores', payload);
        toast.success('Tienda creada');
      }
      setShowModal(false);
      loadStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <>
      <Header title="Tiendas" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Gestión de Tiendas</h1>
            <p>{stores.length} tiendas registradas</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> Nueva Tienda
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-search">
              <HiOutlineMagnifyingGlass className="table-search-icon" />
              <input placeholder="Buscar tienda..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏪</div>
              <div className="empty-state-title">Sin tiendas</div>
              <p>Registra tu primera tienda.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cadena</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Geocerca</th>
                  <th>Coordenadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <HiOutlineMapPin style={{ color: 'var(--color-accent)' }} />
                        {s.name}
                      </div>
                    </td>
                    <td><span className="badge badge-info">{s.chain}</span></td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                    <td>{s.city}</td>
                    <td>{s.geofenceRadius}m</td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', fontFamily: 'monospace' }}>
                      {s.coordinates.lat.toFixed(4)}, {s.coordinates.lng.toFixed(4)}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>
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
                <h3 className="modal-title">{editStore ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineXMark /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cadena</label>
                      <input className="form-input" value={form.chain} onChange={(e) => setForm({ ...form, chain: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ciudad</label>
                      <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <input className="form-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Latitud</label>
                      <input className="form-input" type="number" step="any" value={form.coordinates.lat} onChange={(e) => setForm({ ...form, coordinates: { ...form.coordinates, lat: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Longitud</label>
                      <input className="form-input" type="number" step="any" value={form.coordinates.lng} onChange={(e) => setForm({ ...form, coordinates: { ...form.coordinates, lng: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Geocerca (m)</label>
                      <input className="form-input" type="number" value={form.geofenceRadius} onChange={(e) => setForm({ ...form, geofenceRadius: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{editStore ? 'Guardar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
