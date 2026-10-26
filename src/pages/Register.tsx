import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonImg,
} from '@ionic/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COMUNAS } from '../data/mock';
import api from '../services/api';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [nombre, setNombreCompleto] = useState('');
    const [comuna, setComuna] = useState('');
    const [correo, setCorreo] = useState('');
    const [correo2, setCorreo2] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [permisos, setPermisos] = useState<'INSPECTOR' | 'ADMIN'>('INSPECTOR');
    const [cargando, setCargando] = useState(false);
      const handleRegister = async () => {
    //Valida campos vacios
    if (
      !nombre.trim() ||
      !comuna ||
      !correo.trim() ||
      !correo2.trim() ||
      !password ||
      !password2
    ) {
      alert('Completa todos los campos');
      return;
    }
    // Valida correos iguales
    if (correo !== correo2) {
      alert('Los correos no coinciden');
      return;
    }
    // Valida Mínimo 8 caracteres y al menos un número
    if (password.length < 8 || !/\d/.test(password)) {
      alert('La contraseña debe tener al menos 8 caracteres y un número');
      return;
    }
    // Valida las dos contraseñas iguales
    if (password !== password2) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      setCargando(true);
      await api.post('/auth/register', {
        Email: correo.trim(),
        Nombre: nombre.trim(),
        Comuna: comuna,
        Contrasena: password,
        PermisosUser: permisos,
      });
      alert('Cuenta creada. Ahora inicia sesión.');
      navigate('/login');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage className="auth-page">
      <IonHeader className="ion-no-border">
        <IonToolbar />
      </IonHeader>
      <IonContent className="auth-content auth-split">
        <div className="auth-wrap">
            <IonImg src="/logo.png" alt="Logo" className="auth-logo" />
            
            <div className="auth-card">
                <h1>Crear cuenta</h1>
                <p className="auth-subtitle">Completa tus datos para continuar</p>
                <div className="field">
                  <label className="field-label">
                    Nombre completo <span className="required">*</span>
                  </label>
                <IonInput
                    placeholder="Escribe tu nombre"
                    type="text"
                    required
                    value={nombre}
                    onIonInput={(e) => setNombreCompleto(e.detail.value ?? '')}
                />
                </div>
                <div className="field">
                  <label className="field-label">
                    Selecciona comuna <span className="required">*</span>
                  </label>
                <IonSelect
                    placeholder="Seleccionar..."

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
                  <label className="field-label">
                    Tipo de usuario <span className="required">*</span>
                  </label>
                <IonSelect
                    interface="popover"
                    value={permisos}
                    onIonChange={(e) => setPermisos(e.detail.value)}
                    >
                    <IonSelectOption value="INSPECTOR">Inspector</IonSelectOption>
                    <IonSelectOption value="ADMIN">Administrador</IonSelectOption>
                </IonSelect>
                </div>
                <div className="field">
                  <label className="field-label">
                    Correo <span className="required">*</span>
                  </label>
                <IonInput
                    placeholder="Escribe tu correo"
                    type="email"
                    required
                    value={correo}
                    onIonInput={(e) => setCorreo(e.detail.value ?? '')}
                />
                </div>
                <div className="field">
                  <label className="field-label">
                    Confirmar correo <span className="required">*</span>
                  </label>
                <IonInput
                    placeholder="Confirma tu correo"
                    type="email"
                    required
                    value={correo2}
                    onIonInput={(e) => setCorreo2(e.detail.value ?? '')}
                />
                </div>
                <div className="field">
                  <label className="field-label">
                    Contraseña <span className="required">*</span>
                  </label>
                <IonInput
                    placeholder="Escribe tu contraseña"
                    type="password"
                    required
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value ?? '')}
                />
                </div>
                <IonText color="medium">
                    <p className="hint">Debe contener al menos 8 caracteres con numeros</p>
                </IonText>

                <div className="field">
                  <label className="field-label">
                    Confirmar contraseña <span className="required">*</span>
                  </label>
                <IonInput
                    placeholder="Confirma tu contraseña"
                    type="password"
                    required
                    value={password2}
                    onIonInput={(e) => setPassword2(e.detail.value ?? '')}
                />
                </div>
                <div className="auth-actions">
                  <p className="terms">Al registrarse acepta términos y condiciones</p>

                  <IonButton expand="block" disabled={cargando} onClick={handleRegister}>
                      {cargando ? 'CREANDO...' : 'CREAR CUENTA'}
                  </IonButton>

                  <p className="login-link">
                      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                  </p>
                </div>
            </div>

        </div>
      </IonContent>
    </IonPage>
  );
};
export default Register;