import {
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { CHECKLIST_ITEMS } from '../data/mock';
import { createFiscalizacion, listContratos, type Contrato } from '../services/api';

const NuevaFiscalizacion: React.FC = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contrato, setContrato] = useState<number | ''>('');
  const [asunto, setAsunto] = useState('');
  const [checks, setChecks] = useState([true, true, false]);
  const [foto, setFoto] = useState('');
  const [obs, setObs] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listContratos()
      .then(setContratos)
      .catch((err) => alert(err instanceof Error ? err.message : 'No se pudieron cargar contratos'));
  }, []);

  const toggleCheck = (index: number) => {
    setChecks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const estadoDesdeChecklist = () => {
    const ok = checks.filter(Boolean).length;
    if (ok === 3) return 'CUMPLE';
    if (ok === 2) return 'ALERTA';
    return 'MULTA';
  };

  const enviar = async () => {
    if (!contrato || !asunto.trim()) {
      alert('Completa contrato y asunto');
      return;
    }
    try {
      setEnviando(true);
      await createFiscalizacion({
        Obra: asunto.trim(),
        Ubicacion: 'Ubicación GPS Detectada (-33.045, -71.619)',
        Foto: foto || undefined,
        Observaciones: obs || undefined,
        Estado: estadoDesdeChecklist(),
        IdContrato: Number(contrato),
      });
      alert('Fiscalización enviada');
      navigate('/tabs/historial-reportes', { replace: true });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo enviar la fiscalización');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppShell>
      <div className="sifcom-panel sifcom-form">
        <h2 className="sifcom-section-title">Nueva fiscalización</h2>

        <label>Seleccionar contrato</label>
        <IonSelect
          placeholder="Seleccionar..."
          interface="popover"
          value={contrato}
          onIonChange={(e) => setContrato(e.detail.value)}
        >
          {contratos.map((c) => (
            <IonSelectOption key={c.IdContrato} value={c.IdContrato}>
              {c.Giro || c.Empresa}
            </IonSelectOption>
          ))}
        </IonSelect>

        <label>Asunto / Rubro</label>
        <IonInput
          placeholder="Ej: Plaza, Alumbrado..."
          value={asunto}
          onIonInput={(e) => setAsunto(e.detail.value ?? '')}
        />

        <label>Georreferenciación</label>
        <div className="sifcom-gps">
          <span>📍</span>
          <span>Ubicación GPS Detectada (-33.045, -71.619)</span>
        </div>

        <label>Checklist</label>
        {CHECKLIST_ITEMS.map((item, i) => (
          <label key={item} className="sifcom-check-row">
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={() => toggleCheck(i)}
            />
            {item}
          </label>
        ))}

        <label>Evidencia fotográfica</label>
        <label className="sifcom-file">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0]?.name ?? '')}
          />
          📷 {foto || 'Adjuntar fotografía'}
        </label>

        <label>Observaciones</label>
        <IonTextarea
          placeholder="Ingresar Observaciones"
          value={obs}
          onIonInput={(e) => setObs(e.detail.value ?? '')}
        />

        <IonButton expand="block" className="sifcom-submit" disabled={enviando} onClick={() => void enviar()}>
          {enviando ? 'Enviando...' : 'Enviar Fiscalización'}
        </IonButton>
      </div>
    </AppShell>
  );
};

export default NuevaFiscalizacion;
