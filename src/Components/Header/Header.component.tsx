import React, { Fragment, FC } from 'react';
import NavigationComponent from './Navigation.component';
import NotificationComponent from './Notifications.component';

const HeaderComponent: FC = () => {
  return (
    <>
      <NotificationComponent />
      {/* <NavigationComponent /> */}
    </>
  );
};

export default HeaderComponent;
