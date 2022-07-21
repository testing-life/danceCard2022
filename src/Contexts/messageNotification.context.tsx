import { DocumentData } from '@firebase/firestore';
import React, { useState, useContext, useEffect } from 'react';
import { Collections } from '../Constants/collections';
import { collection, db, onSnapshot, orderBy, query, where } from '../Firebase/firebase';
import { useProfile } from './profile.context';

type MsgNotificationConsumer = {
  msg: DocumentData;
  setMsg: (value: DocumentData | any) => any;
};

const MsgNotificationContext = React.createContext<MsgNotificationConsumer>({} as MsgNotificationConsumer);

type Props = {
  children: React.ReactNode;
};

const createFnCounter = (fn: any, invokeBeforeExecution: boolean) => {
  let count: any = 0;
  return (args: any) => {
    count++;
    if (count <= invokeBeforeExecution) {
      return true;
    } else {
      return fn(args, count);
    }
  };
};

const handleActivitySubscription = (snapshot: any, counter: any) => {
  const initialLoad = counter === 1;
};

export const MsgNotificationProvider = ({ ...props }: Props) => {
  const { profile } = useProfile();
  const [msg, setMsg] = useState<MsgNotificationConsumer>({} as MsgNotificationConsumer);

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
            setMsg(doc);
          }
        });
      });
    }
    // res.size  ?
    //docs arra , take last ?

    return () => unsubscribe;
  }, [profile]);

  return <MsgNotificationContext.Provider value={{ msg, setMsg }} {...props} />;
};

const { Consumer: MsgNotificationConsumer } = MsgNotificationContext;

export const useMsgNotification = () => {
  const context = useContext(MsgNotificationContext);
  if (context === undefined) {
    throw new Error('must use in UserProvider');
  }
  return context;
};