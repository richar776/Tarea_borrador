import { IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { COMUNAS } from '../data/mock';
import { findRegisteredUser, saveRegisteredUser } from '../data/users';

const Perfil: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const permiso = user?.rol === 'admin' ? 'Administrador Municipal' : 'Inspector';
  const saved = user ? findRegisteredUser(user.correo) : undefined;

  const [nombre, setNombre] = useState(user?.nombre || 'Usuario');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [password, setPassword] = useState(saved?.password || '');
  const [comuna, setComuna] = useState(user?.comuna || 'Valparaíso');

  const guardar = () => {
    if (!nombre.trim() || !correo.trim()) {
      alert('Completa nombre y correo');
      return;
    }
    updateUser({ nombre: nombre.trim(), correo: correo.trim(), comuna });
    saveRegisteredUser({
      nombre: nombre.trim(),
      correo: correo.trim(),
      password: password || saved?.password || '',
      comuna,
    });
    alert('Cambios guardados');
  };

  const salir = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppShell title="Perfil del usuario">
      <div className="sifcom-panel perfil-panel">
        <img src="/perfil.png" alt="Perfil" className="perfil-avatar" />

        <div className="perfil-card">
          <h2>Datos personales</h2>
          <p className="perfil-hint">Seleccione el dato que desea modificar</p>

          <div className="perfil-grid">
            <div className="field">
              <label className="field-label">Nombre</label>
              <IonInput
                placeholder="Usuario"
                value={nombre}
                onIonInput={(e) => setNombre(e.detail.value ?? '')}
              />
            </div>
            <div className="field">
              <label className="field-label">Comuna</label>
              <IonSelect
                interface="popover"
                value={comuna}
                onIonChange={(e) => setComuna(e.detail.value)}
              >
                {COMUNAS.map((c) => (
                  <IonSelectOption key={c} value={c}>
                    {c}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div className="field">
              <label className="field-label">Correo</label>
              <IonInput
                type="email"
                placeholder="micorreo@gmail.com"
                value={correo}
                onIonInput={(e) => setCorreo(e.detail.value ?? '')}
              />
            </div>
            <div className="field">
              <label className="field-label">
                Permisos actuales <span className="required">*</span>
              </label>
              <IonInput className="permiso-locked" value={permiso} readonly disabled />
            </div>
            <div className="field">
              <label className="field-label">Contraseña</label>
              <IonInput
                type="password"
                placeholder="********"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
              />
            </div>
          </div>

          <IonButton className="perfil-save" onClick={guardar}>
            Guardar cambios
          </IonButton>
          <p className="login-link perfil-logout">
            <button type="button" onClick={salir}>Cerrar sesión</button>
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default Perfil;
