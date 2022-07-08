import React from 'react';
import { LoginComponent } from '../Components/Login/Login.component';
import { UserProvider } from '../Contexts/user.context';
import { GeolocationProvider } from '../Contexts/geolocation.context';

export const LoginPage = (_: any) => {
  return (
    <UserProvider>
      <GeolocationProvider>
        <LoginComponent />
      </GeolocationProvider>
    </UserProvider>
  );
};
