import React from 'react';
import { ProfileProvider } from '../Contexts/profile.context';
import SingleChatComponent from '../Components/SingleChat/SingleChat.component';
import NavigationComponent from '../Components/Header/Navigation.component';
import { useLocation } from 'react-router-dom';

export const SingleChatPage = () => {
  const location = useLocation();
  return (
    <ProfileProvider>
      <NavigationComponent />
      <SingleChatComponent routeProps={location!.state} />
    </ProfileProvider>
  );
};
