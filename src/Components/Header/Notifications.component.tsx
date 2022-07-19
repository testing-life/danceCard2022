import React, { FunctionComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useMsgNotification } from '../../Contexts/messageNotification.context';
import { useProfile } from '../../Contexts/profile.context';
import * as ROUTES from '../../Constants/routes';

const NotificationComponent: FunctionComponent = () => {
  const { msg } = useMsgNotification();
  const { profile } = useProfile();

  const lastMessage = msg?.exists ? msg?.data().messages[msg?.data().messages.length - 1] : undefined;
  const lastMessageSenderId = lastMessage?.fromID;
  const fromMe = lastMessageSenderId === profile?.uid ? true : false;

  return (
    <Fragment>
      {lastMessage && !fromMe ? (
        <Fragment>
          <span>
            Latest message: <strong>{lastMessage.message}</strong>{' '}
          </span>
          <Link to={ROUTES.SINGLE_CHAT} state={{ targetChatID: msg.id }}>
            Go to chat
          </Link>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default NotificationComponent;
