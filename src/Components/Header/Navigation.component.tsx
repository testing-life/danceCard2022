import React, { FunctionComponent, useRef } from 'react';
import * as ROUTES from '../../Constants/routes';
import { doSignOut } from '../../Firebase/firebase';
import './Navigation.component.css';
import { Link, useNavigate } from 'react-router-dom';

const NavigationComponent: FunctionComponent = () => {
  const navigate = useNavigate();
  // const { clearUser } = useUser();
  // const { profile } = useProfile();
  // const isLoggedIn = firebase.getCurrentUser();

  // useEffect(() => {
  //   console.log('profile :>> ', profile);
  //   if (!profile.active) {
  //     chatLinkRef.current?.setAttribute('disabled', 'true');
  //   } else {
  //     chatLinkRef.current?.removeAttribute('disabled');
  //   }
  //   console.log('object', chatLinkRef);
  // }, [profile]);

  return (
    <div>
      <nav>
        <Link className="button" to={ROUTES.HOME}>
          Home
        </Link>
        <Link className="button" to={ROUTES.PROFILE}>
          Profile
        </Link>
        {/* <Link
          className={`button ${profile.active ? '' : 'disabled'}`}
          to={profile.active ? ROUTES.CHATS : './'}
        >
          Chats
        </Link> */}
        <button
          className="button button-outline"
          onClick={() => {
            doSignOut();
            localStorage.clear();
          }}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default NavigationComponent;
