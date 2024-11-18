import React, { useCallback, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC = () => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;

  // Apelăm hook-urile înainte de a returna orice componentă
  const handlePasswordChange = useCallback((e: any) => setState({
    ...state,
    password: e.detail.value || ''
  }), [state]);

  const handleUsernameChange = useCallback((e: any) => setState({
    ...state,
    username: e.detail.value || ''
  }), [state]);

  const handleLogin = useCallback(() => {
    log('handleLogin...');
    login?.(username, password);
  }, [username, password, login]);

  // Verificăm dacă utilizatorul este deja autentificat și redirecționăm înainte de a randa orice element
  if (isAuthenticated) {
    return <Redirect to="/items" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <IonInput
            placeholder="Username"
            value={username}
            onIonChange={handleUsernameChange}
            clearInput
            style={{ marginBottom: '15px', width: '80%' }}
          />
          <IonInput
            placeholder="Password"
            value={password}
            onIonChange={handlePasswordChange}
            type="password"
            clearInput
            style={{ marginBottom: '25px', width: '80%' }}
          />
          <IonButton
            expand="full"
            onClick={handleLogin}
            disabled={isAuthenticating}
            style={{ marginTop: '10px' }}
          >
            Login
          </IonButton>
          
          {authenticationError && (
            <div style={{ color: 'red', marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>
              {authenticationError.message || 'Failed to authenticate'}
            </div>
          )}
        </div>
        <IonLoading isOpen={isAuthenticating} message="Authenticating..." />
      </IonContent>
    </IonPage>
  );
};
