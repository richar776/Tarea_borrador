import AppShell from '../components/AppShell';
import { CONTRATOS } from '../data/mock';

const alertaTexto = (n: number) => {
  if (n === 0) return '0 Alertas registradas';
  if (n === 1) return '1 Alerta registrada';
  return `${n} Alertas registradas`;
};

const Contratos: React.FC = () => (
  <AppShell>
    <div className="sifcom-panel">
      <h2 className="sifcom-section-title">Contratos</h2>
      <div className="sifcom-list">
        {CONTRATOS.map((c) => (
          <article key={c.nombre} className="sifcom-item">
            <h3>{c.nombre}</h3>
            <p>Empresa: {c.empresa}</p>
            <p>Presupuesto: {c.presupuesto}</p>
            <p>Vigencia: {c.vigencia}</p>
            <p className="sifcom-status">
              <span className={`dot dot-${c.nivel}`} />
              {alertaTexto(c.alertas)}
            </p>
          </article>
        ))}
      </div>
    </div>
  </AppShell>
);

export default Contratos;
