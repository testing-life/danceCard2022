import React from 'react';
import SignUpComponent from '../Components/SignUp/Signup.component';
import { GeolocationProvider } from '../Contexts/geolocation.context';

export const SignUpPage = () => {
  return (
    <GeolocationProvider>
      <SignUpComponent />
    </GeolocationProvider>
  );
};
