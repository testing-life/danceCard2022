import React from 'react';
import { ProfileProvider } from '../Contexts/profile.context';
import SingleChatComponent from '../Components/SingleChat/SingleChat.component';
import NavigationComponent from '../Components/Header/Navigation.component';
import { useLocation } from 'react-router-dom';
import { MsgNotificationProvider } from '../Contexts/messageNotification.context';

export const SingleChatPage = () => {
  const location = useLocation();
  return (
    <ProfileProvider>
      <MsgNotificationProvider>
        <NavigationComponent />
        <SingleChatComponent routeProps={location!.state} />
      </MsgNotificationProvider>
    </ProfileProvider>
  );
};
