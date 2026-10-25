import { IonButton } from '@ionic/react';
import AppShell from '../components/AppShell';

const ACCIONES = [
  'Administrar Perfiles/Usuarios',
  'Asignar/Configurar Checklists',
  'Gestionar contratos y estados',
  'Administrar multas',
];

const AdminPanel: React.FC = () => (
  <AppShell>
    <div className="sifcom-panel">
      <h2 className="sifcom-section-title">Panel de administración</h2>
      <div className="admin-actions">
        {ACCIONES.map((texto) => (
          <IonButton
            key={texto}
            expand="block"
            onClick={() => alert(`${texto} (próximamente)`)}
          >
            {texto}
          </IonButton>
        ))}
      </div>
    </div>
  </AppShell>
);

export default AdminPanel;
