import Header from '../../components/Header';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

export default function Bonos() {
  return (
    <>
      <Header title="Bonificaciones" />
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Bonificaciones</h1>
            <p>Configuración y cálculo de bonos e incentivos</p>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Bono Operativo</h3>
              <span className="badge badge-success">Activo</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-md)' }}>
              Basado en la completitud de evidencias parametrizadas. Penalizaciones por omisiones o exceder la tolerancia de 15 minutos.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fórmula</span>
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>
                (evidencias / total) × base - penalizaciones
              </span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Bono de Ventas + Acelerador</h3>
              <span className="badge badge-accent">Configurable</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-md)' }}>
              El supervisor define categorías y reglas. Pago extra por unidad vendida sobre el 100% de la meta.
            </p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-xs) 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>0-100% Meta</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Bono base proporcional</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-xs) 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>&gt;100% (Acelerador)</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>+$15 MXN / unidad extra</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-lg)', textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <HiOutlineCurrencyDollar style={{ fontSize: '3rem', color: 'var(--color-accent)', opacity: 0.5 }} />
          <h3 style={{ marginTop: 'var(--space-md)', color: 'var(--text-primary)' }}>Configurador de Bonos</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
            El módulo completo de configuración por promotor/tienda/categoría se activará con datos de ventas cargados.
          </p>
        </div>
      </div>
    </>
  );
}
