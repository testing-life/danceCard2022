import React, { useState, useContext, useEffect } from 'react';
import { Profile } from '../Models/profile.models';
import {
  auth,
  query,
  db,
  collection,
  getDocs,
  updateDoc,
  where,
  doc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from '../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Collections } from '../Constants/collections';
import * as geofire from 'geofire-common';
import { LatLngLiteral } from 'leaflet';

type ProfileConsumer = {
  profile: Profile | undefined;
  profileError: string;
  updateProfile: (newProfile: Profile) => void;
  updateLocationInProfile: (newCoords: LatLngLiteral) => void;
  updateVisibilityInProfile: (isActive: boolean) => void;
  toggleUserBlock: (
    direction: 'block' | 'unblock',
    blockedById: string,
    userToBlockDocId: string,
    userToBlockId: string,
  ) => void;
};

const ProfileContext = React.createContext<ProfileConsumer>({} as ProfileConsumer);

type Props = {
  children: React.ReactNode;
};

export const ProfileProvider = ({ ...props }: Props) => {
  const [profile, setProfileInState] = useState<Profile>();
  const [user, loading, authError] = useAuthState(auth);
  const [profileError, setProfileError] = useState('');

  const setLocalProfile = async () => {
    const res = await getUserProfile();
    if (res) {
      setProfileInState(res);
    }
  };

  useEffect(() => {
    if (!loading && user && !profile) {
      setLocalProfile();
    }
  }, [loading, user]);

  useEffect(() => {
    let unsubscribe: any = null;
    if (user) {
      const profileQuery = query(collection(db, Collections.Users), where('uid', '==', user?.uid));
      unsubscribe = onSnapshot(profileQuery, (querySnapshot: any) => {
        querySnapshot.docChanges().forEach((change: any) => {
          setProfileInState(change.doc.data());
        });
      });
    }
    return () => unsubscribe;
  }, [user]);

  const getUserProfile = async () => {
    const userQuery = query(collection(db, Collections.Users), where('uid', '==', user?.uid));

    const doc = await getDocs(userQuery).catch(e => setProfileError(e.message));
    const profileData = doc?.docs.length ? ({ ...doc.docs[0].data(), docId: doc?.docs[0].id } as Profile) : null;
    return profileData;
  };

  //
  const updateProfile = async (newProfile: any): Promise<void> => {
    const userRef = profile && doc(db, Collections.Users, profile.docId);
    if (userRef) {
      await updateDoc(userRef, newProfile).catch(e => setProfileError(e.message));
    }
  };

  const updateLocationInProfile = async (newCoords: LatLngLiteral): Promise<void> => {
    const userRef = profile && doc(db, Collections.Users, profile.docId);
    const hash = geofire.geohashForLocation([newCoords.lat, newCoords.lng]);
    if (userRef) {
      await updateDoc(userRef, { lat: newCoords.lat, lng: newCoords.lng, hash }).catch(e =>
        setProfileError(e.message),
      );
      // getUserProfile();
    }
  };

  const toggleUserBlock = async (
    direction: 'block' | 'unblock',
    blockedById: string,
    userToBlockDocId: string,
    userToBlockId: string,
  ) => {
    const userToBeBlockedRef = profile && doc(db, Collections.Users, userToBlockDocId);
    const userRef = profile && doc(db, Collections.Users, profile.docId);

    if (userToBeBlockedRef && userRef) {
      await updateDoc(userToBeBlockedRef, {
        blockedBy: direction === 'block' ? arrayUnion(blockedById) : arrayRemove(blockedById),
      }).catch(e => console.error(e.message));
      await updateDoc(userRef, {
        blockedUsers: direction === 'block' ? arrayUnion(userToBlockId) : arrayRemove(userToBlockId),
      }).catch(e => console.error(e.message));
    }
  };

  const updateVisibilityInProfile = async (isActive: boolean): Promise<void> => {
    const userRef = profile && doc(db, Collections.Users, profile.docId);
    if (userRef) {
      await updateDoc(userRef, { active: isActive }).catch(e => setProfileError(e.message));
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        toggleUserBlock,
        profileError,
        updateLocationInProfile,
        updateVisibilityInProfile,
      }}
      {...props}
    />
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
