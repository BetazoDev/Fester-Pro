import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineXMark, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function Catalogo() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sku: '', category: '', brand: 'Fester' });
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/catalog/categories'),
        api.get('/catalog/products'),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      toast.error('Error al cargar catálogo');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    if (activeTab === 'categories') {
      setForm({ name: '', description: '' });
    } else {
      setForm({ name: '', description: '', sku: '', category: categories[0]?._id || '', brand: 'Fester' });
    }
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    if (activeTab === 'categories') {
      setForm({ name: item.name, description: item.description });
    } else {
      setForm({ name: item.name, description: item.description, sku: item.sku || '', category: item.category?._id || '', brand: item.brand });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'categories' ? '/catalog/categories' : '/catalog/products';
    try {
      if (editItem) {
        await api.put(`${endpoint}/${editItem._id}`, form);
        toast.success('Actualizado');
      } else {
        await api.post(endpoint, form);
        toast.success('Creado');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const filtered = activeTab === 'categories'
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Header title="Catálogo" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Catálogo de Productos</h1>
            <p>{categories.length} categorías, {products.length} productos</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> {activeTab === 'categories' ? 'Nueva Categoría' : 'Nuevo Producto'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          <button className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('categories')}>
            Categorías ({categories.length})
          </button>
          <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('products')}>
            Productos ({products.length})
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-search">
              <HiOutlineMagnifyingGlass className="table-search-icon" />
              <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : activeTab === 'categories' ? (
            <table>
              <thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.description || '—'}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><HiOutlinePencil /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead><tr><th>Nombre</th><th>SKU</th><th>Categoría</th><th>Marca</th><th>Acciones</th></tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{p.sku || '—'}</td>
                    <td><span className="badge badge-accent">{p.category?.name || '—'}</span></td>
                    <td>{p.brand}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><HiOutlinePencil /></button></td>
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
                <h3 className="modal-title">{editItem ? 'Editar' : 'Crear'} {activeTab === 'categories' ? 'Categoría' : 'Producto'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineXMark /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  {activeTab === 'products' && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">SKU</label>
                          <input className="form-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Marca</label>
                          <input className="form-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                          <option value="">Seleccionar...</option>
                          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{editItem ? 'Guardar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
