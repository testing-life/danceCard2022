import React from 'react';
import { LoginComponent } from '../Components/Login/Login.component';
import { GeolocationProvider } from '../Contexts/geolocation.context';

export const LoginPage = (_: any) => {
  return (
    <GeolocationProvider>
      <LoginComponent />
    </GeolocationProvider>
  );
};
