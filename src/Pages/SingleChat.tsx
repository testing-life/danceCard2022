import React from 'react';
import { ProfileProvider } from '../Contexts/profile.context';
import SingleChatComponent from '../Components/SingleChat/SingleChat.component';
import NavigationComponent from '../Components/Header/Navigation.component';
import { useLocation } from 'react-router-dom';
import { MsgNotificationProvider } from '../Contexts/messageNotification.context';
import { ChatProps } from '../Components/ChatInput/ChatInput.component';

export const SingleChatPage = () => {
  const { state } = useLocation();
  return (
    <ProfileProvider>
      <MsgNotificationProvider>
        <NavigationComponent />
        <SingleChatComponent routeProps={state as ChatProps} />
      </MsgNotificationProvider>
    </ProfileProvider>
  );
};
