import React, { FC, useState, useEffect } from 'react';
import { collection, db, onSnapshot, orderBy, query, where } from '../../Firebase/firebase';
import ChatInputComponent from '../ChatInput/ChatInput.component';
import './ChatsList.component.css';
// import { useMsgNotification } from '../../Contexts/messageNotification.context';
import { isObjectWithValue } from '../../Utils/object';
import { Collections } from '../../Constants/collections';
import { useProfile } from '../../Contexts/profile.context';
import { sortChatsAsc } from '../../Utils/array';

const ChatsListComponent: FC = () => {
  // QueryDocumentSnapshot
  const [localChats, setLocalChats] = useState<any>();
  const { profile } = useProfile();
  // const { msg } = useMsgNotification();
  const [isFlashed, setIsFlashed] = useState(false);
  let unsubscribe: any = null;

  useEffect(() => {
    if (profile) {
      localChatsListener();
    }

    return () => unsubscribe;
  }, [profile]);

  const localChatsListener = () => {
    const chatsQuery = query(
      collection(db, Collections.Chats),
      where('members', 'array-contains', profile?.uid),
      orderBy('last_updated'),
    );

    unsubscribe = onSnapshot(chatsQuery, (querySnapshot: any) => {
      const newLocalChats: any[] = [];
      querySnapshot.forEach((doc: any) => {
        newLocalChats.push({ ...doc.data(), docId: doc.id });
      });
      setLocalChats(newLocalChats);
    });
  };

  return (
    <>
      {!localChats?.length && <p>no chats</p>}
      {localChats?.map((item: any, index: number) => {
        const messages = isObjectWithValue(item, 'messages') ? item.messages.sort(sortChatsAsc) : undefined;
        const existingChatID: string = item.docId;
        const targetUserID = () => item.members.find((id: string) => id !== profile!.uid);
        return (
          <div key={`${index}`}>
            {messages ? (
              <details className="container" open={isFlashed && index === 0 ? true : false}>
                <summary
                  className={isFlashed && index === 0 ? 'isFlashed' : ''}
                  onClick={() => isFlashed && index === 0 && setIsFlashed(false)}
                >
                  {messages[0]?.toName ? messages[0]?.toName : 'Mystery user'},
                  {new Date(messages[0].timestamp).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </summary>
                {messages.map(
                  (
                    item: {
                      message: string;
                      timestamp: number;
                      fromName: string;
                      fromID: string;
                    },
                    index: number,
                  ) => (
                    <div className={item.fromID === profile!.uid ? 'messageBoxFrom' : 'messageBoxTo'} key={`${index}`}>
                      <strong> From: {item.fromName}</strong> <p>{item.message}</p>
                    </div>
                  ),
                )}
                <ChatInputComponent
                  routeProps={{ targetUserID: targetUserID(), existingChatID, targetUsername: messages[0]?.toName }}
                />
              </details>
            ) : (
              <p>There may have been a chat here that got corrupted.</p>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ChatsListComponent;
