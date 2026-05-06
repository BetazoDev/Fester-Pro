import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import { HiOutlineClock, HiOutlineMapPin } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function Asistencia() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { loadAttendance(); }, [date]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/attendance?date=${date}`);
      setRecords(data.records || []);
    } catch (err) {
      toast.error('Error al cargar asistencia');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => t ? new Date(t).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—';

  const statusBadge = (s) => {
    const map = { 'on-time': 'badge-success', late: 'badge-warning', absent: 'badge-danger', pending: 'badge-info' };
    const labels = { 'on-time': 'A tiempo', late: 'Retardo', absent: 'Ausente', pending: 'Pendiente' };
    return <span className={`badge ${map[s]}`}>{labels[s] || s}</span>;
  };

  return (
    <>
      <Header title="Asistencia" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Control de Asistencia</h1>
            <p>Registros del {new Date(date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineClock /></div>
              <div className="empty-state-title">Sin registros</div>
              <p>No hay registros de asistencia para esta fecha.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Promotor</th>
                  <th>Tienda</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Estado</th>
                  <th>GPS</th>
                  <th>Distancia</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.user?.name || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                        <HiOutlineMapPin style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                        <span>{r.store?.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{formatTime(r.checkIn?.time)}</td>
                    <td style={{ fontFamily: 'monospace' }}>{formatTime(r.checkOut?.time)}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>
                      <span className={`badge ${r.isValidGPS ? 'badge-success' : 'badge-danger'}`}>
                        {r.isValidGPS ? 'Válido' : 'Fuera de rango'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{r.gpsDistance}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
