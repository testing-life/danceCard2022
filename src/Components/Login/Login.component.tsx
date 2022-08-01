import React, { useState, useEffect, FC } from 'react';
import { auth, doEmailSignIn } from '../../Firebase/firebase';
import * as ROUTES from '../../Constants/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export const LoginComponent: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const { location, locationError } = useGeo();
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [signinError, setSigninError] = useState('');

  useEffect(() => {
    if (user) {
      navigate(ROUTES.HOME);
    }
  }, [user, loading]);

  const submitHandler = async (data: any) => {
    const { email, password } = data;
    await doEmailSignIn(email, password).catch(e => setSigninError(e.message));
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(submitHandler)}>
        <label>
          {' '}
          Email
          <br />
          <input type="email" placeholder="email" {...register('email', { required: true })} />
        </label>
        <br /> <br />
        <label>
          <br />
          <input type="password" placeholder="password" {...register('password', { required: true })} />
        </label>
        <br /> <br />
        {signinError && <p>{signinError}</p>}
        <button type="submit">log in</button>
      </form>
      <Link to={ROUTES.SIGN_UP}>No account? Register.</Link>
      <br />
      <Link to={ROUTES.PASSWORD_RESET}>Forgot password? Reset.</Link>
    </div>
  );
};
