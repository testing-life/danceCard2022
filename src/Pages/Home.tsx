import React, { Fragment } from 'react';
import { HomeComponent } from '../Components/Home/Home.component';
import HeaderComponent from '../Components/Header/Header.component';
import { GeolocationProvider } from '../Contexts/geolocation.context';
// import { GeolocationProvider } from '../Contexts/geolocation.context';
// import { ProfileProvider } from '../Contexts/profile.context';
// import Firebase, { FirebaseContext } from '../Firebase/firebase';

const HomePage = (_: any) => {
  return (
    <>
      <GeolocationProvider>
        {/* <HeaderComponent /> */}
        <HomeComponent />
      </GeolocationProvider>
    </>
    // <
  );
};

export default HomePage;
