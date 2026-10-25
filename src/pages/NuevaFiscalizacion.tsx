import {
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/react';
import { useState } from 'react';
import AppShell from '../components/AppShell';
import { CHECKLIST_ITEMS, CONTRATOS } from '../data/mock';

const NuevaFiscalizacion: React.FC = () => {
  const [contrato, setContrato] = useState('');
  const [asunto, setAsunto] = useState('');
  const [checks, setChecks] = useState([true, true, false]);
  const [foto, setFoto] = useState('');
  const [obs, setObs] = useState('');

  const toggleCheck = (index: number) => {
    setChecks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const enviar = () => {
    if (!contrato || !asunto.trim()) {
      alert('Completa contrato y asunto');
      return;
    }
    alert('Fiscalización enviada (simulado)');
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
          {CONTRATOS.map((c) => (
            <IonSelectOption key={c.nombre} value={c.nombre}>
              {c.nombre}
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

        <IonButton expand="block" className="sifcom-submit" onClick={enviar}>
          Enviar Fiscalización
        </IonButton>
      </div>
    </AppShell>
  );
};

export default NuevaFiscalizacion;
