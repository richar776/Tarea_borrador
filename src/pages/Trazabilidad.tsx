import AppShell from '../components/AppShell';
import { TRAZAS } from '../data/mock';

const Trazabilidad: React.FC = () => (
  <AppShell>
    <div className="sifcom-panel">
      <h2 className="sifcom-section-title">Historial y trazabilidad</h2>
      <div className="sifcom-list">
        {TRAZAS.map((t) => (
          <article key={t.id} className="sifcom-item">
            <h3>Reporte {t.id}</h3>
            <p>{t.detalle}</p>
            <p>{t.fecha} · Admin: {t.admin}</p>
            <p>Ref: {t.ref}</p>
          </article>
        ))}
      </div>
    </div>
  </AppShell>
);

export default Trazabilidad;
