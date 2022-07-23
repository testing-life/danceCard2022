import React, { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMsgNotification } from '../../Contexts/messageNotification.context';
import { useProfile } from '../../Contexts/profile.context';
import * as ROUTES from '../../Constants/routes';

const NotificationComponent: FunctionComponent = () => {
  const { msg } = useMsgNotification();
  const { profile } = useProfile();

  const lastMessage = msg?.exists ? msg?.data().messages[msg?.data().messages.length - 1] : undefined;
  const lastMessageSenderId: string = lastMessage?.fromID;
  const isFromMe = lastMessageSenderId === profile?.uid ? true : false;
  const targetUserId = msg?.exists && msg?.data().members.filter((item: string) => item !== lastMessageSenderId);

  useEffect(() => {
    if (msg && !isFromMe) {
      const img = 'https://www.iconsdb.com/icons/preview/white/edit-xxl.png';
      const text = lastMessage.message;
      const notification = new Notification('New Message', { body: text, icon: img });
    }
  }, [msg]);

  return (
    <>
      {lastMessage && !isFromMe ? (
        <>
          <span>
            Latest message: <strong>{lastMessage.message}</strong>{' '}
          </span>
          <Link
            to={ROUTES.SINGLE_CHAT}
            state={{ targetChatID: msg.id, targetUsername: lastMessage.toName, targetUserID: targetUserId }}
          >
            Go to chat
          </Link>
        </>
      ) : null}
    </>
  );
};

export default NotificationComponent;
