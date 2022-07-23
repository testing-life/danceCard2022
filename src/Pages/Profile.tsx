import React from 'react';
import Profile from '../Components/Profile/Profile.page';
import { ProfileProvider } from '../Contexts/profile.context';
import HeaderComponent from '../Components/Header/Header.component';
import { MsgNotificationProvider } from '../Contexts/messageNotification.context';

export const ProfilePage = () => {
  return (
    <>
      <ProfileProvider>
        <MsgNotificationProvider>
          <HeaderComponent />
          <Profile />
        </MsgNotificationProvider>
      </ProfileProvider>
    </>
  );
};
