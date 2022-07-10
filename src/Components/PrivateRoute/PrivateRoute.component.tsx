import React, { FunctionComponent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../Contexts/auth.context';
import * as ROUTES from '../../Constants/routes';
import { auth } from '../../Firebase/firebase';

const PrivateRoute: FunctionComponent<any> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  if (!loading) {
    if (!user) {
      return <Navigate to={ROUTES.LOG_IN} state={{ from: location }} replace />;
    }
  }
  return children;
};

export default PrivateRoute;
