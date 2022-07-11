import React, { useState, useContext, useEffect } from 'react';
import { Profile } from '../Models/profile.models';
import { auth, query, db, collection, getDocs, updateDoc, where, doc } from '../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Collections } from '../Constants/collections';
import * as geofire from 'geofire-common';
import { LatLngLiteral } from 'leaflet';

type ProfileConsumer = {
  profile: any;
  profileError: string;
  updateProfile: (val: any) => void;
  updateLocationInProfile: (newCoords: LatLngLiteral) => void;
};

const ProfileContext = React.createContext<ProfileConsumer>({} as ProfileConsumer);

type Props = {
  children: React.ReactNode;
};

export const ProfileProvider = ({ ...props }: Props) => {
  const [profile, setProfileInState] = useState<any>();
  const [user, loading, authError] = useAuthState(auth);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const setLocalProfile = async () => {
      const res = await getUserProfile();
      if (res) {
        setProfileInState(res);
      }
    };
    if (!loading && user) {
      setLocalProfile();
    }
  }, [loading, user]);

  const getUserProfile = async () => {
    const q = query(collection(db, Collections.Users), where('uid', '==', user?.uid));
    const doc = await getDocs(q).catch(e => setProfileError(e.message));
    return doc ? { ...doc.docs[0].data(), docId: doc?.docs[0].id } : null;
  };

  const updateProfile = async (newProfile: any): Promise<void> => {
    const userRef = doc(db, Collections.Users, profile.docId);
    if (userRef) {
      await updateDoc(userRef, newProfile).catch(e => setProfileError(e.message));
    }
  };

  const updateLocationInProfile = async (newCoords: LatLngLiteral): Promise<void> => {
    const userRef = doc(db, Collections.Users, profile.docId);
    const hash = geofire.geohashForLocation([newCoords.lat, newCoords.lng]);
    console.log('newCoords', newCoords, hash);
    if (userRef) {
      await updateDoc(userRef, { lat: newCoords.lat, lng: newCoords.lng, hash }).catch(e =>
        setProfileError(e.message),
      );
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, profileError, updateLocationInProfile }} {...props} />
  );
};

const { Consumer: ProfileConsumer } = ProfileContext;

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('must use in ProfileProvider');
  }
  return context;
};
