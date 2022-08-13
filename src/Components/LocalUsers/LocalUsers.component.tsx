import React, { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGeo } from '../../Contexts/geolocation.context';
import { useProfile } from '../../Contexts/profile.context';
import { Profile } from '../../Models/profile.models';
import { auth } from '../../Firebase/firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';
import ProfilePopup from '../ProfilePopoup/ProfilePopup.component';
import './LocalUsers.components.css';

type Props = {
  localUsers: Profile[];
  radius: number;
  userActive?: boolean;
};

export const LocalUsersComponent: FC<Props> = ({ localUsers, radius }) => {
  const { location, locationError } = useGeo();
  const { profile, toggleUserBlock } = useProfile();
  const [user] = useAuthState(auth);
  const toggleBlockUser = async (
    direction: 'block' | 'unblock',
    blockedById: string,
    userToBlockDocId: string,
    userToBlockUid: string,
  ) => await toggleUserBlock(direction, blockedById, userToBlockDocId, userToBlockUid);

  return (
    <ul>
      {profile &&
        localUsers
          ?.filter((otherUser: Profile) => !(profile.blockedBy as string[]).includes(otherUser.uid))
          .map((otherUser: Profile) => {
            return user?.uid !== otherUser.uid && otherUser.active ? (
              <li className="localUsers__item" key={otherUser.uid}>
                <>
                  {otherUser.username}
                  <ProfilePopup dances={otherUser.dances} />
                  {(otherUser.blockedBy as string[]).includes(profile.uid) ? (
                    <button onClick={() => toggleBlockUser('unblock', profile.uid, otherUser.docId, otherUser.uid)}>
                      Unblock User
                    </button>
                  ) : (
                    <button onClick={() => toggleBlockUser('block', profile.uid, otherUser.docId, otherUser.uid)}>
                      Block User
                    </button>
                  )}
                  <Link
                    to={ROUTES.CHATS}
                    state={{
                      targetUserDocID: otherUser.docId,
                      targetUserID: otherUser.uid,
                      targetUsername: otherUser.username,
                    }}
                  >
                    Message
                  </Link>
                </>
              </li>
            ) : null;
          })}
    </ul>
  );
};
