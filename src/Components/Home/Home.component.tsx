import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
import { getUsersInRadius } from '../../Firebase/firebase';

// import { LeafletMap } from '../Map/Map.component';
// import { useGeo } from '../../Contexts/geolocation.context';
// import Firebase from '../../Firebase/firebase';
// import { GeoQuery, GeoQuerySnapshot } from 'geofirestore';
// import { GeoFirestoreTypes } from 'geofirestore/dist/GeoFirestoreTypes';
// import { LatLngLiteral } from 'leaflet';
// import { useUser } from '../../Contexts/user.context';
// import { useProfile } from '../../Contexts/profile.context';
// import { Profile } from '../../Models/profile.models';
import { useGeo } from '../../Contexts/geolocation.context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { LeafletMap } from '../Map/Map.component';

export const HomeComponent: FunctionComponent<any> = () => {
  const { location, locationError } = useGeo();
  // const { user } = useUser();
  // const { profile, setProfile } = useProfile();
  // const [error, setError] = useState<string>();
  const [localUsers, setLocalUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  // const [radius, setRadius] = useState<number>(2);

  const fetchLocalUsers = async (location: any) => {
    const matches = await getUsersInRadius([location.lat, location.lng]);
    setLocalUsers(matches);
  };

  // const radiusSliderHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   setRadius(+e.target.value);
  // };

  useEffect(() => {
    if (Object.keys(location).length) {
      fetchLocalUsers(location);
    }
  }, [location, locationError]);

  // const toggleVisiblity = () => {
  //   const newProfile: Profile = { ...profile, active: !profile.active };
  //   firebase
  //     .getUsers()
  //     .doc(user.uid)
  //     .set(newProfile, { merge: true })
  //     .then(
  //       docRef => {
  //         setProfile(newProfile);
  //       },
  //       (error: Error) => setError(error.message),
  //     );
  // };

  return (
    <>
      <LeafletMap localUsers={localUsers} />
      {/* {error && <p>{error}</p>}
      <div className="row">
        <p className="column">
          You're currently: {profile.active ? 'Visible! Happy to dance.' : 'Invisible. Having a quiet moment.'}{' '}
        </p>
        <button className="column" onClick={toggleVisiblity}>
          Toggle visibility
        </button>
      </div>
      <div className="row">
        <span>Search radius: {radius}km</span>
        <input
          type="range"
          name="radius"
          defaultValue={radius}
          min="1"
          step="1"
          max="20"
          onChange={radiusSliderHandler}
        />
      </div>
      {locationError && <p>{locationError.message}</p>}
      {!!Object.keys(location).length ? (
        <LeafletMap radius={radius} centre={location} markers={localUsers} userActive={profile.active} />
      ) : (
        <p>We do need geolocation to show the map. Please enable it in your browser and reload the page.</p>
      )} */}
    </>
  );
};
