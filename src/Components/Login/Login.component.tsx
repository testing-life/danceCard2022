import React, { Fragment, FunctionComponent, useState, useEffect, FC } from 'react';
import { auth, doEmailSignIn, doSignOut } from '../../Firebase/firebase';
import * as ROUTES from '../../Constants/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { useForm, OnSubmit } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/user.context';
import { useForm } from 'react-hook-form';
// import { useGeo } from '../../Contexts/geolocation.context';

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
    const res = await doEmailSignIn(email, password).catch(e => setSigninError(e.message));
    console.log('res', res, error);
  };
  // const getGeoPoint: (latitude: number, longitude: number) => firebase.firestore.GeoPoint = (latitude, longitude) => {
  //   return firebase.getGeoPoint(latitude, longitude);
  // };

  // const submitHandler: OnSubmit<any> = ({ email, password }, event): void => {
  //   firebase
  //     .doEmailSignIn(email, password)
  //     .then((res: any) => {
  //       console.log('res', res);
  //       const { uid, email, displayName, name, refreshToken } = res.user.toJSON();
  //       res.user.getIdToken();
  //       console.log('object', res.user.getIdToken());
  //       localStorage.setItem(
  //         'user',
  //         JSON.stringify(Object.assign({}, { uid, email, displayName, name, refreshToken })),
  //       );
  //       setUser!({ uid, email, displayName, name, refreshToken });

  //       firebase
  //         .getUsers()
  //         .doc(uid)
  //         .update({
  //           coordinates: getGeoPoint(location.lat ?? 0, location.lng ?? 0),
  //         })
  //         .then(
  //           () => {
  //             navigate(ROUTES.HOME);
  //           },
  //           error => setError(error),
  //         );
  //     })
  //     .catch((error: Error) => {
  //       setError(error);
  //     });
  // };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(submitHandler)}>
        <input type="email" placeholder="email" {...register('email', { required: true })} />
        <input type="password" placeholder="password" {...register('password', { required: true })} />
        {signinError && <p>{signinError}</p>}
        <button type="submit">log in</button>
      </form>
      <Link to={ROUTES.SIGN_UP}>No account? Register.</Link>
    </div>
  );
};
