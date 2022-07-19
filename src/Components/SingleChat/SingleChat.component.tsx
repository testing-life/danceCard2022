import React, { FunctionComponent, useState, useEffect } from 'react';
import { Collections } from '../../Constants/collections';
import { useProfile } from '../../Contexts/profile.context';
import { onSnapshot, doc, db } from '../../Firebase/firebase';
import { sortMessagesDesc } from '../../Utils/array';
import ChatInputComponent from '../ChatInput/ChatInput.component';
// import ChatInputComponent from '../ChatInput/ChatInput.component';
// import { sortMessagesDesc } from '../../Utils/array';

type Props = {
  routeProps?: any;
};

const SingleChatComponent: FunctionComponent<Props> = ({ ...props }) => {
  const { targetUserDocID, targetUsername, targetUserID, targetChatID } = props.routeProps;
  const [state, setState] = useState<any>();
  const { profile } = useProfile();

  // const targetUserID = (array: string[]) =>
  //   array.find((id: string) => id !== user.uid);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, Collections.Chats, targetChatID), doc => {
      console.log('Current data: ', doc.data());
      setState(doc.data());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      {!state && <p>no chat</p>}
      {state?.messages.sort(sortMessagesDesc).map((item: any, index: number) => {
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
          existingChatID: state?.id ? state?.id : null,
        }}
      />
    </div>
  );
};

export default SingleChatComponent;
