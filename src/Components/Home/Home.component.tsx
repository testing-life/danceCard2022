import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
import { getUsersInRadius, query, collection, db, where, onSnapshot, auth } from '../../Firebase/firebase';

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
import { useProfile } from '../../Contexts/profile.context';
import { RADIUS_IN_M } from '../../Constants/locatingParams';
import { Collections } from '../../Constants/collections';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateObjArrayWithOtherArrayOfObj } from '../../Utils/object';

export const HomeComponent: FunctionComponent<any> = () => {
  const { location, locationError } = useGeo();
  const [user, loading, authError] = useAuthState(auth);
  const { profile, updateVisibilityInProfile } = useProfile();
  // const [error, setError] = useState<string>();
  const [localUsers, setLocalUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [radius, setRadius] = useState(RADIUS_IN_M);

  const fetchLocalUsers = async (location: any) => {
    const snapshots = await getUsersInRadius([location.lat, location.lng], radius);
    const users: any[] = [];
    snapshots.forEach((doc: any) => {
      users.push(doc.data());
    });
    setLocalUsers(users);
  };

  const radiusSliderHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRadius(parseInt(e.target.value));
  };

  const localUsersListener = () => {
    const userQuery = query(collection(db, Collections.Users));

    const unsubscribe = onSnapshot(userQuery, (querySnapshot: any) => {
      const newLocalUsers: any[] = [];
      querySnapshot.forEach((doc: any) => {
        newLocalUsers.push(doc.data());
      });
      setLocalUsers(newLocalUsers);
    });
  };

  useEffect(() => {
    if (user) {
      localUsersListener();
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(location).length) {
      fetchLocalUsers(location);
    }
  }, [location, locationError, radius]);

  const toggleVisiblity = (e: any) => {
    if (profile) {
      updateVisibilityInProfile(!profile.active);
    }
  };

  return (
    <>
      <div className="row">
        {profile && (
          <p className="column">
            {profile.username} is currently:{' '}
            {profile.active ? 'Visible! Happy to dance.' : 'Invisible. Having a quiet moment.'}
          </p>
        )}
        <button className="column" onClick={e => toggleVisiblity(e)}>
          Toggle visibility
        </button>
      </div>
      <div className="row">
        <span>Search radius: {radius / 1000}km</span>
        <input
          type="range"
          name="radius"
          value={radius}
          min="1"
          step="100"
          max="20000"
          onChange={radiusSliderHandler}
        />
      </div>
      {locationError && <p>{locationError.message}</p>}

      <LeafletMap localUsers={localUsers} radius={radius} />
    </>
  );
};
