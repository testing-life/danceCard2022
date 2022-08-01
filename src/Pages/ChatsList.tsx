import React from 'react';
import { ProfileProvider } from '../Contexts/profile.context';
import ChatsListComponent from '../Components/ChatsList/ChatsList.component';
import ChatInputComponent, { ChatProps } from '../Components/ChatInput/ChatInput.component';
import { useLocation } from 'react-router-dom';
import { MsgNotificationProvider } from '../Contexts/messageNotification.context';
import HeaderComponent from '../Components/Header/Header.component';

export const ChatsListPage = () => {
  const { state } = useLocation();
  //set callback to hide topmost chat component
  return (
    <ProfileProvider>
      <MsgNotificationProvider>
        <HeaderComponent />
        {state ? <ChatInputComponent routeProps={state as ChatProps} /> : null}

        <ChatsListComponent />
      </MsgNotificationProvider>
    </ProfileProvider>
  );
};
