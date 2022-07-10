import React, { FC } from 'react';
import { HomeComponent } from '../Components/Home/Home.component';
import HeaderComponent from '../Components/Header/Header.component';
import { GeolocationProvider } from '../Contexts/geolocation.context';
import { ProfileProvider } from '../Contexts/profile.context';

const HomePage: FC = () => {
  return (
    <>
      <GeolocationProvider>
        <ProfileProvider>
          <HeaderComponent />
          <HomeComponent />
        </ProfileProvider>
      </GeolocationProvider>
    </>
    // <
  );
};

export default HomePage;
