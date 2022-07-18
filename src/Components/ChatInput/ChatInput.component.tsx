import React, { FunctionComponent, useState, FormEvent, useEffect } from 'react';
import { useUser } from '../../Contexts/user.context';
import { useProfile } from '../../Contexts/profile.context';
import { GeoDocumentReference } from 'geofirestore/dist/GeoDocumentReference';
import { Profile } from '../../Models/profile.models';
import * as ROUTES from '../../Constants/routes';
import { useNavigate } from 'react-router-dom';
import { addDoc, auth, collection, db, doc, updateDoc, arrayUnion } from '../../Firebase/firebase';
import { Collections } from '../../Constants/collections';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

type Props = {
  routeProps: any;
};

const ChatInputComponent: FunctionComponent<Props> = ({ ...props }) => {
  const { targetUserID, existingChatID, targetUsername, targetUserDocID } = props.routeProps;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('');
  const navigate = useNavigate();
  const { profile, chatDocs } = useProfile();

  useEffect(() => {
    if (existingChatID) {
      setCurrentChatId(existingChatID);
    }
  }, []);

  const updateChatsIdInProfile = async (chatID: string) => {
    if ((profile.chats as string[]).includes(chatID)) {
      return;
    }
    const chats: string[] = Array.from(new Set([...profile.chats, chatID]));
    const userRef = doc(db, Collections.Users, profile.docId);
    const otherUserRef = doc(db, Collections.Users, targetUserDocID);
    //if target id === user.uid, cancel
    if (userRef && otherUserRef) {
      await updateDoc(userRef, { chats }).catch(e => console.error(e.message));
      await updateDoc(otherUserRef, { chats }).catch(e => console.error(e.message));
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
      })
        .catch(e => console.error(e.message))
        .finally(() => setIsSending(false));
    } else {
      const ref = await addDoc(collection(db, Collections.Chats), {
        members: [targetUserID, profile.uid],
        last_updated: +new Date(),
      }).catch((error: Error) => setError(error.message));
      console.log('res', ref);
      if (ref) {
        setCurrentChatId(ref.id);
        updateChatsIdInProfile(ref.id);
        const res = await updateDoc(ref, {
          messages: {
            fromName: profile.username,
            toName: targetUsername,
            fromID: profile.uid,
            message: message,
            timestamp: +new Date(),
          },
        })
          .catch(e => console.error(e.message))
          .finally(() => setIsSending(false));
        console.log('res', res);
      }
      // firebase
      //   .getChats()
      //   .add({ members: [targetUserID, user.uid], last_updated: +new Date() })
      //   .then(refID => {
      //     setCurrentChatId(refID.id);
      //     updateChatsIdInProfile(refID.id);
      //     refID
      //       .update({
      //         messages: firebase.fieldValue.arrayUnion({
      //           fromName: profile.username,
      //           toName: targetUsername,
      //           fromID: user.uid,
      //           message: message,
      //           timestamp: +new Date(),
      //         }),
      //       })
      //       .then(() => {
      //         setIsSending(false);
      //         navigate(ROUTES.CHATS);
      //       })
      //       .catch((e: Error) => setError(e));
      //   });
    }
    setMessage('');
  };
  // if (currentChatId) {
  //   firebase
  //     .getChats()
  //     .doc(currentChatId)
  //     .update({
  //       messages: firebase.fieldValue.arrayUnion({
  //         toName: targetUsername,
  //         fromName: profile.username,
  //         fromID: user.uid,
  //         message: message,
  //         timestamp: +new Date(),
  //       }),
  //       last_updated: +new Date(),
  //     })
  //     .then(() => {
  //       setIsSending(false);
  //     })
  //     .catch((e: Error) => setError(e));
  //   setMessage('');
  // } else {
  //   firebase
  //     .getChats()
  //     .add({ members: [targetUserID, user.uid], last_updated: +new Date() })
  //     .then(refID => {
  //       setCurrentChatId(refID.id);
  //       updateChatsIdInProfile(refID.id);
  //       refID
  //         .update({
  //           messages: firebase.fieldValue.arrayUnion({
  //             fromName: profile.username,
  //             toName: targetUsername,
  //             fromID: user.uid,
  //             message: message,
  //             timestamp: +new Date(),
  //           }),
  //         })
  //         .then(() => {
  //           setIsSending(false);
  //           navigate(ROUTES.CHATS);
  //         })
  //         .catch((e: Error) => setError(e));
  //     });
  // }
  // setMessage('');
  return (
    <>
      {(targetUsername || targetUserID) && (
        <form onSubmit={submitHandler} className="container">
          <input
            type="text"
            name="message"
            placeholder={!currentChatId ? `Your first message to ${targetUsername}` : 'Write message'}
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
