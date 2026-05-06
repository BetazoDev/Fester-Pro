import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function Excepciones() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadExceptions(); }, []);

  const loadExceptions = async () => {
    try {
      const { data } = await api.get('/attendance/exceptions');
      setExceptions(data);
    } catch (err) {
      toast.error('Error al cargar excepciones');
    } finally {
      setLoading(false);
    }
  };

  const getExceptionType = (r) => {
    if (!r.isValidGPS) return { label: 'GPS Fuera de Rango', badge: 'badge-danger' };
    if (r.status === 'late') return { label: 'Retardo', badge: 'badge-warning' };
    if (r.toleranceExceeded) return { label: 'Tolerancia Excedida', badge: 'badge-warning' };
    return { label: 'Otro', badge: 'badge-info' };
  };

  return (
    <>
      <Header title="Excepciones" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Tablero de Excepciones</h1>
            <p>{exceptions.length} alertas activas</p>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : exceptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-title">Sin excepciones</div>
              <p>Todas las operaciones están dentro de los parámetros.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Fecha</th><th>Promotor</th><th>Tienda</th><th>Tipo</th><th>Distancia GPS</th><th>Hora Entrada</th></tr>
              </thead>
              <tbody>
                {exceptions.map((r) => {
                  const { label, badge } = getExceptionType(r);
                  return (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString('es-MX')}</td>
                      <td style={{ fontWeight: 600 }}>{r.user?.name || '—'}</td>
                      <td>{r.store?.name || '—'}</td>
                      <td><span className={`badge ${badge}`}><HiOutlineExclamationTriangle /> {label}</span></td>
                      <td style={{ fontFamily: 'monospace' }}>{r.gpsDistance}m</td>
                      <td style={{ fontFamily: 'monospace' }}>{r.checkIn?.time ? new Date(r.checkIn.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
