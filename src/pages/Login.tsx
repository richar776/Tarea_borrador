import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonButton,
  IonImg,
} from '@ionic/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mapApiUser, useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!correo.trim() || !password) {
      alert('Completa todos los campos');
      return;
    }
    try {
      setCargando(true);
      const { data } = await api.post('/auth/login', {
        Email: correo.trim(),
        Contrasena: password,
      });
      login(mapApiUser(data.user), data.token);
      navigate('/tabs/home', { replace: true });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
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
          <IonImg src="/logo.png" alt="SIFCOM" className="auth-logo" />

          <div className="auth-card">
            <h1>Inicio de sesión</h1>
            <p className="auth-subtitle">Inicia sesión para continuar</p>

            <div className="field">
              <label className="field-label">Correo</label>
              <IonInput
                placeholder="Ingresa tu correo"
                type="email"
                required
                value={correo}
                onIonInput={(e) => setCorreo(e.detail.value ?? '')}
              />
            </div>

            <div className="field">
              <label className="field-label">Contraseña</label>
              <IonInput
                placeholder="Ingresa tu contraseña"
                type="password"
                required
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
              />
            </div>

            <div className="auth-actions">
              <IonButton expand="block" shape="round" disabled={cargando} onClick={handleLogin}>
                {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
              </IonButton>
              <p className="login-link">
                ¿No tienes cuenta? <Link to="/register">Crea tu cuenta aquí</Link>
              </p>
              <p className="login-link">
                <Link to="/recuperar">Recuperar contraseña</Link>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
