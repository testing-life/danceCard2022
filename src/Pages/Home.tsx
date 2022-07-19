import React, { FC } from 'react';
import { HomeComponent } from '../Components/Home/Home.component';
import HeaderComponent from '../Components/Header/Header.component';
import { GeolocationProvider } from '../Contexts/geolocation.context';
import { ProfileProvider } from '../Contexts/profile.context';
import { MsgNotificationProvider } from '../Contexts/messageNotification.context';

const HomePage: FC = () => {
  return (
    <>
      <GeolocationProvider>
        <ProfileProvider>
          <MsgNotificationProvider>
            <HeaderComponent />
            <HomeComponent />
          </MsgNotificationProvider>
        </ProfileProvider>
      </GeolocationProvider>
    </>
    // <
  );
};

export default HomePage;
