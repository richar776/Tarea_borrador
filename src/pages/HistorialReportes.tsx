import AppShell from '../components/AppShell';
import { REPORTES } from '../data/mock';

const HistorialReportes: React.FC = () => (
  <AppShell>
    <div className="sifcom-panel">
      <h2 className="sifcom-section-title">Historial De Reportes</h2>
      <div className="sifcom-list">
        {REPORTES.map((r) => (
          <article key={r.titulo} className="sifcom-item">
            <h3>{r.titulo}</h3>
            <p>📅 {r.fecha} · Inspector: {r.inspector}</p>
            <p>Checklist: {r.checklist} cumplidos</p>
            <p className="sifcom-status">
              <span className={`dot dot-${r.nivel}`} />
              {r.estado}
            </p>
          </article>
        ))}
      </div>
    </div>
  </AppShell>
);

export default HistorialReportes;
