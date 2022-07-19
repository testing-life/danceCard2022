import React from 'react';
// import { RouteComponentProps } from '@reach/router';
// import Firebase, { FirebaseContext } from '../Firebase/firebase';
// import { UserProvider } from '../Contexts/user.context';
import { ProfileProvider } from '../Contexts/profile.context';
// import NavigationComponent from '../Components/Header/Navigation.component';
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
