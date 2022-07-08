import React, { Fragment, FunctionComponent, useState, useEffect, FC } from 'react';
import { addDoc, auth, createUserWithEmailAndPassword, db } from '../../Firebase/firebase';
import * as ROUTES from '../../Constants/routes';
import { useForm } from 'react-hook-form';
// import { useGeo } from '../../Contexts/geolocation.context';
import { Profile } from '../../Models/profile.models';
import ErrorMessages from '../../Constants/errors';
import { collection } from 'firebase/firestore';

export const SignUpComponent: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const { location, locationError } = useGeo();
  const [error, setError] = useState<string | undefined>(undefined);

  // const getGeoPoint: (latitude: number, longitude: number) => firebase.firestore.GeoPoint = (latitude, longitude) => {
  //   return firebase.getGeoPoint(latitude, longitude);
  // };

  const submitHandler = async (data: any) => {
    const { email, password, username } = data;
    console.log('data', email, password, username);
    const res: any = await createUserWithEmailAndPassword(auth, email, password).catch(e => console.error(e));
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      username,
      email,
    }).catch(e => console.error(e.message));
    // firebase
    //   .doEmailRegistration(email, password)
    //   .then((res: any) => {
    //     if (res) {
    //       const doc = {
    //         ...Profile.create(),
    //         uid: res.user.uid,
    //         username: username,
    //         email: res.user.email,
    //         coordinates: getGeoPoint(location.lat, location.lng),
    //       };

    //       firebase
    //         .getUsers()
    //         .doc(res.user.uid)
    //         .set(doc)
    //         .then(
    //           docRef => {
    //             navigate(ROUTES.LOG_IN);
    //           },
    //           error => setError(error),
    //         );
    //     }
    //   })
    //   .catch((error: Error) => setError(error.message));
  };

  return (
    <div className="container">
      <br />
      <form onSubmit={handleSubmit(submitHandler)}>
        <input required type="text" placeholder="username" {...register('username', { required: true })} />
        <input required type="email" placeholder="email" {...register('email', { required: true })} />
        <input required type="password" placeholder="password" {...register('password', { required: true })} />
        {errors.email && <p>email is required</p>}
        {error && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
      {/* //{' '}
      <p>
        // {locationError.message}, {locationError.code}. <br />
        // {ErrorMessages.get(locationError.code)}
        // <br />
        //{' '}
        <a href="https://browserhow.com/how-to-enable-disable-geolocation-access-in-google-chrome/" target="_blank">
          // Enable geolocation in Chrome //{' '}
        </a>
        // <br />
        //{' '}
        <a href="https://browserhow.com/how-to-enable-or-disable-location-access-in-apple-safari/" target="_blank">
          // Enable geolocation in Safari //{' '}
        </a>
        // <br />
        //{' '}
        <a href="https://support.mozilla.org/en-US/kb/site-permissions-panel/" target="_blank">
          // Enable geolocation in Firefox //{' '}
        </a>
        //{' '} */}
      {/* </p> */}
    </div>
  );
};

export default SignUpComponent;
