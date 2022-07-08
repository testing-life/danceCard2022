import React, { useEffect, FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';
import { auth } from '../../Firebase/firebase';

export const LandingComponent: FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    user ? navigate(ROUTES.HOME) : navigate(ROUTES.LOG_IN);
  }, []);

  return <></>;
};
