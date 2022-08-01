import React, { FunctionComponent, useState, useEffect } from 'react';
import { Collections } from '../../Constants/collections';
import { useProfile } from '../../Contexts/profile.context';
import { onSnapshot, doc, db } from '../../Firebase/firebase';
import { sortChatsAsc } from '../../Utils/array';
import ChatInputComponent from '../ChatInput/ChatInput.component';

type Props = {
  routeProps?: any;
};

const SingleChatComponent: FunctionComponent<Props> = ({ ...props }) => {
  const { targetUserDocID, targetUsername, targetUserID, targetChatID } = props.routeProps;
  const [state, setState] = useState<any>();
  const { profile } = useProfile();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, Collections.Chats, targetChatID), doc => {
      setState(doc.data());
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {!state && <p>no chat</p>}
      {state?.messages.sort(sortChatsAsc).map((item: any, index: number) => {
        return (
          <div key={`${index}`} className={item.fromID === profile?.uid ? 'messageBoxFrom' : 'messageBoxTo'}>
            <strong> From: {item.fromName}</strong> <p>{item.message}</p>
          </div>
        );
      })}
      <ChatInputComponent
        routeProps={{
          targetUserID: targetUserID,
          targetUserDocID: targetUserDocID,
          targetUsername: targetUsername,
          existingChatID: targetChatID,
        }}
      />
    </>
  );
};

export default SingleChatComponent;
