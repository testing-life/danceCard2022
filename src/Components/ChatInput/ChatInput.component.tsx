import React, { FunctionComponent, useState, FormEvent, useEffect } from 'react';
import { useProfile } from '../../Contexts/profile.context';
import * as ROUTES from '../../Constants/routes';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, db, doc, updateDoc, arrayUnion } from '../../Firebase/firebase';
import { Collections } from '../../Constants/collections';

type Props = {
  routeProps: any;
};

const ChatInputComponent: FunctionComponent<Props> = ({ ...props }) => {
  const { targetUserID, existingChatID, targetUsername, targetUserDocID } = props.routeProps;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('');
  const { profile } = useProfile();

  useEffect(() => {
    if (existingChatID) {
      setCurrentChatId(existingChatID);
    }
  }, []);

  const updateChatsIdInProfile = async (chatID: string) => {
    if ((profile.chats as string[]).includes(chatID)) {
      return;
    }
    const userRef = doc(db, Collections.Users, profile.docId);
    const otherUserRef = doc(db, Collections.Users, targetUserDocID);
    //if target id === user.uid, cancel
    if (userRef && otherUserRef) {
      await updateDoc(userRef, { chats: arrayUnion(chatID) }).catch(e => setError(e.message));
      await updateDoc(otherUserRef, { chats: arrayUnion(chatID) }).catch(e => setError(e.message));
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    if (currentChatId) {
      const docRef = doc(db, Collections.Chats, currentChatId);
      await updateDoc(docRef, {
        messages: arrayUnion({
          fromName: profile.username,
          toName: targetUsername,
          fromID: profile.uid,
          message: message,
          timestamp: +new Date(),
        }),
        last_updated: +new Date(),
      })
        .catch(e => setError(e.message))
        .finally(() => setIsSending(false));
    } else {
      const ref = await addDoc(collection(db, Collections.Chats), {
        members: [targetUserID, profile.uid],
        last_updated: +new Date(),
      }).catch((error: Error) => setError(error.message));
      if (ref) {
        setCurrentChatId(ref.id);
        updateChatsIdInProfile(ref.id);
        await updateDoc(ref, {
          messages: [
            {
              fromName: profile.username,
              toName: targetUsername,
              fromID: profile.uid,
              message: message,
              timestamp: +new Date(),
            },
          ],
        })
          .catch(e => setError(e.message))
          .finally(() => setIsSending(false));
      }
    }
    setMessage('');
  };

  return (
    <>
      {(targetUsername || targetUserID) && (
        <form onSubmit={submitHandler} className="container">
          <input
            type="text"
            name="message"
            placeholder={!currentChatId ? `Start a new chat with ${targetUsername}` : 'Write message'}
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <button type="submit">{isSending ? 'sending...' : 'send'}</button>
          {error && <p>Something went wrong with sending the message: {error}</p>}
        </form>
      )}
    </>
  );
};

export default ChatInputComponent;
