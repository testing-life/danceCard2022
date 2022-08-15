import { DocumentData } from '@firebase/firestore';
import React, { useState, useContext, useEffect } from 'react';
import { Collections } from '../Constants/collections';
import { collection, db, onSnapshot, query, where } from '../Firebase/firebase';
import { Message } from '../Models/messages.model';
import { useProfile } from './profile.context';

type MsgConsumer = {
  msg: DocumentData;
  setMsg: (value: DocumentData) => any;
};

const MsgContext = React.createContext<MsgConsumer>({} as MsgConsumer);

type Props = {
  children: React.ReactNode;
};

export const MsgProvider = ({ ...props }: Props) => {
  const { profile } = useProfile();
  const [msg, setMsg] = useState<DocumentData>({});
  const [localMsg, setLocalMsg] = useState<DocumentData>();

  const comesFromBlocked = (message: Message, blockedArray: string[]): any => {
    if (!blockedArray.length) {
      return false;
    }
    return message.members.some((item: string) => blockedArray.includes(item));
  };

  useEffect(() => {
    let unsubscribe: any = null;
    if (profile?.uid) {
      const chatsQuery = query(
        collection(db, Collections.Chats),
        where('members', 'array-contains', profile?.uid),
        where('last_updated', '>', +(+new Date())),
      );

      unsubscribe = onSnapshot(chatsQuery, (querySnapshot: any) => {
        querySnapshot.docChanges().forEach(({ doc }: DocumentData) => {
          if (doc?.data().hasOwnProperty('messages')) {
            setLocalMsg(doc);
          }
        });
      });
    }
    // res.size  ?
    //docs arra , take last ?

    return () => unsubscribe;
  }, [profile]);

  useEffect(() => {
    if (localMsg && profile) {
      const message: Message = localMsg.data();
      const isOriginBlocked = comesFromBlocked(message, profile!.blockedUsers);
      if (!isOriginBlocked) {
        setMsg(localMsg);
      }
    }
  }, [localMsg]);

  return <MsgContext.Provider value={{ msg, setMsg }} {...props} />;
};

const { Consumer: MsgConsumer } = MsgContext;

export const useMsg = () => {
  const context = useContext(MsgContext);
  if (context === undefined) {
    throw new Error('must use in UserProvider');
  }
  return context;
};
