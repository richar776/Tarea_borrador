import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { listContratos, listFiscalizaciones, type Contrato, type Fiscalizacion } from '../services/api';
import { formatDate } from '../utils/format';

const Trazabilidad: React.FC = () => {
  const [items, setItems] = useState<Fiscalizacion[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  useEffect(() => {
    Promise.all([listFiscalizaciones(), listContratos()])
      .then(([f, c]) => {
        setItems(f);
        setContratos(c);
      })
      .catch((err) => alert(err instanceof Error ? err.message : 'No se pudo cargar la trazabilidad'));
  }, []);

  const nombreContrato = (id: number) =>
    contratos.find((c) => c.IdContrato === id)?.Giro || `Contrato #${id}`;

  return (
    <AppShell>
      <div className="sifcom-panel">
        <h2 className="sifcom-section-title">Historial y trazabilidad</h2>
        <div className="sifcom-list">
          {items.length === 0 && (
            <article className="sifcom-item">
              <p>No hay movimientos registrados.</p>
            </article>
          )}
          {items.map((t) => (
            <article key={t.IdFiscalizacion} className="sifcom-item">
              <h3>Reporte #{t.IdFiscalizacion}</h3>
              <p>{t.Estado}{t.Observaciones ? ` → ${t.Observaciones}` : ''}</p>
              <p>{formatDate(t.FechaFisc)}</p>
              <p>Ref: {t.Obra} ({nombreContrato(t.IdContrato)})</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Trazabilidad;
