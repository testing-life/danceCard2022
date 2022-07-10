import React, { useState, useContext, useEffect } from 'react';
import { Profile } from '../Models/profile.models';
import { auth, query, db, collection, getDocs, updateDoc, where, doc } from '../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Collections } from '../Constants/collections';

type ProfileConsumer = {
  profile: any;
  profileError: string;
  updateProfile: (val: any) => void;
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

  return <ProfileContext.Provider value={{ profile, updateProfile, profileError }} {...props} />;
};

const { Consumer: ProfileConsumer } = ProfileContext;

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('must use in ProfileProvider');
  }
  return context;
};
