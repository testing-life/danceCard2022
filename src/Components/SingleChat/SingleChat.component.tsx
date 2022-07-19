import React, { FunctionComponent, useState, useEffect } from 'react';
import { Collections } from '../../Constants/collections';
import { useUser } from '../../Contexts/user.context';
import { onSnapshot, doc, db } from '../../Firebase/firebase';
import { sortMessagesDesc } from '../../Utils/array';
import ChatInputComponent from '../ChatInput/ChatInput.component';
// import ChatInputComponent from '../ChatInput/ChatInput.component';
// import { sortMessagesDesc } from '../../Utils/array';

type Props = {
  routeProps?: any;
};

const SingleChatComponent: FunctionComponent<Props> = ({ ...props }) => {
  const { targetUserDocID, targetUsername, targetUserID } = props.routeProps;
  const [state, setState] = useState<any>();
  const { user } = useUser();

  // const targetUserID = (array: string[]) =>
  //   array.find((id: string) => id !== user.uid);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, Collections.Chats, targetUserDocID), doc => {
      console.log('Current data: ', doc.data());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      # single chat
      {!state && <p>no chat</p>}
      {state
        ?.data()
        .messages.sort(sortMessagesDesc)
        .map((item: any, index: number) => {
          return (
            <div key={`${index}`} className={item.fromID === user.uid ? 'messageBoxFrom' : 'messageBoxTo'}>
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
