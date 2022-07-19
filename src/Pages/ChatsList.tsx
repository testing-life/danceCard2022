import React from 'react';
import { ProfileProvider } from '../Contexts/profile.context';
import ChatsListComponent from '../Components/ChatsList/ChatsList.component';
import NavigationComponent from '../Components/Header/Navigation.component';
import ChatInputComponent from '../Components/ChatInput/ChatInput.component';
import { useLocation } from 'react-router-dom';

export const ChatsListPage = () => {
  const location = useLocation();
  //set callback to hide topmost chat component
  return (
    <ProfileProvider>
      <NavigationComponent />
      {location?.state ? <ChatInputComponent routeProps={location!.state} /> : null}

      <ChatsListComponent />
    </ProfileProvider>
  );
};
