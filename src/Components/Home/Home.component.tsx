import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
import { getUsersInRadius, query, collection, db, onSnapshot, auth } from '../../Firebase/firebase';

import { useGeo } from '../../Contexts/geolocation.context';
import { useProfile } from '../../Contexts/profile.context';
import { RADIUS_IN_M } from '../../Constants/locatingParams';
import { Collections } from '../../Constants/collections';
import { useAuthState } from 'react-firebase-hooks/auth';
import ErrorMessages from '../../Constants/errors';
import { Profile } from '../../Models/profile.models';
import { LocalUsersComponent } from '../LocalUsers/LocalUsers.component';

export const HomeComponent: FunctionComponent<any> = () => {
  const { location, locationError } = useGeo();
  const [user, loading, authError] = useAuthState(auth);
  const { profile, updateVisibilityInProfile, updateLocationInProfile } = useProfile();
  const [localUsers, setLocalUsers] = useState<Profile[]>([]);
  const [radius, setRadius] = useState(RADIUS_IN_M);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

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
  useEffect(() => {
    let unsubscribe: any = null;

    if (user) {
      const userQuery = query(collection(db, Collections.Users));
      unsubscribe = onSnapshot(userQuery, (querySnapshot: any) => {
        const newLocalUsers: any[] = [];
        if (firstLoad) {
          setFirstLoad(false);
        } else {
          querySnapshot.forEach((doc: any) => {
            if (localUsers.find(item => item.uid === doc.uid)) {
              newLocalUsers.push(doc.data());
            }
          });
          setLocalUsers(newLocalUsers);
        }
      });
    }
    return () => unsubscribe;
  }, [user]);

  useEffect(() => {
    console.log('location', location);
    if (Object.keys(location).length) {
      fetchLocalUsers(location);
      updateLocationInProfile(location);
    }
  }, [location, locationError, radius]);

  const toggleVisiblity = (e: any) => {
    if (profile) {
      updateVisibilityInProfile(!profile.active);
    }
  };

  const askNotificationPermission = () => {
    // function to actually ask the permissions
    function handlePermission(permission: any) {
      console.log('permission', permission);
      // set the button to shown or hidden, depending on what the user answers
      Notification.permission === 'granted' ? setNotificationPermission(true) : setNotificationPermission(false);
    }

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then(permission => {
        handlePermission(permission);
      });
    } else {
      Notification.requestPermission(permission => {
        handlePermission(permission);
      });
    }
  };

  const checkNotificationPromise = () => {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }

    return true;
  };

  return (
    <>
      <div className="row">
        {!notificationPermission && <button onClick={askNotificationPermission}>Allow notifications</button>}
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
      {locationError && (
        <p>
          {locationError.code}
          {locationError.message}
          {ErrorMessages.get(locationError.code)}
        </p>
      )}
      {localUsers.length ? (
        <LocalUsersComponent localUsers={localUsers} radius={radius} />
      ) : (
        <p>no users within this range</p>
      )}
    </>
  );
};
