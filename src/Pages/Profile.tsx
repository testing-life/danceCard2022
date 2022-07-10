import React from 'react';
// import Firebase, { FirebaseContext } from '../Firebase/firebaseBKP';
import Profile from '../Components/Profile/Profile.page';
// import { UserProvider } from '../Contexts/user.context';
import { ProfileProvider } from '../Contexts/profile.context';
import HeaderComponent from '../Components/Header/Header.component';

export const ProfilePage = () => {
  return (
    <>
      <ProfileProvider>
        <HeaderComponent />
        <Profile />
      </ProfileProvider>
    </>
  );
};
