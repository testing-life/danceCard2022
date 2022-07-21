import React, { useState, FC } from 'react';
import { addDoc, auth, createUserWithEmailAndPassword, db } from '../../Firebase/firebase';
import * as ROUTES from '../../Constants/routes';
import { useForm } from 'react-hook-form';
import { useGeo } from '../../Contexts/geolocation.context';
import { Profile } from '../../Models/profile.models';
import ErrorMessages from '../../Constants/errors';
import { collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Collections } from '../../Constants/collections';

export const SignUpComponent: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { location, locationError } = useGeo();
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const submitHandler = async (data: any) => {
    const { email, password, username } = data;
    const res: any = await createUserWithEmailAndPassword(auth, email, password).catch((error: Error) =>
      setError(error.message),
    );
    const user = res.user;
    const updateRes = await addDoc(collection(db, Collections.Users), {
      ...Profile.create(),
      uid: user.uid,
      username,
      email,
      ...location,
    }).catch((error: Error) => setError(error.message));
    if (updateRes) {
      navigate(ROUTES.LOG_IN);
    }
  };

  return (
    <>
      {Object.entries(location).length !== 0 ? (
        <form onSubmit={handleSubmit(submitHandler)}>
          <input required type="text" placeholder="username" {...register('username', { required: true })} />
          <input required type="email" placeholder="email" {...register('email', { required: true })} />
          <input required type="password" placeholder="password" {...register('password', { required: true })} />
          {errors.email && <p>email is required</p>}
          {error && <p>{error}</p>}
          <button type="submit">Register</button>
        </form>
      ) : locationError?.code ? (
        <div>
          <p>{`${locationError.code} ${locationError.message}`}</p>
          <p>
            {ErrorMessages.get(locationError.code)}
            <br />
            <a
              href="https://browserhow.com/how-to-enable-disable-geolocation-access-in-google-chrome/"
              target="_blank"
              rel="noreferrer"
            >
              Enable geolocation in Chrome
            </a>
            <br />
            <a
              href="https://browserhow.com/how-to-enable-or-disable-location-access-in-apple-safari/"
              target="_blank"
              rel="noreferrer"
            >
              Enable geolocation in Safari
            </a>
            <br />
            <a href="https://support.mozilla.org/en-US/kb/site-permissions-panel/" target="_blank" rel="noreferrer">
              Enable geolocation in Firefox
            </a>
          </p>
        </div>
      ) : null}
    </>
  );
};

export default SignUpComponent;
