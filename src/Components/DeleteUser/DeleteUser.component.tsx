import { EmailAuthCredential } from 'firebase/auth';
import React, { ChangeEvent, FC, useState } from 'react';
import { useProfile } from '../../Contexts/profile.context';
import { doDeleteUser, doDeleteProfile, getCredential, doReauthenticate } from '../../Firebase/firebase';
import './DeleteUser.component.css';

const DeleteUser: FC = () => {
  const [isSure, setIsSure] = useState(false);
  const [error, setError] = useState('');
  const [mustReauth, setMustReauth] = useState(false);
  const { profile } = useProfile();

  const deleteHandler = async () => {
    if (!profile?.docId) {
      return;
    }
    await doDeleteUser().catch(e => {
      setError(e.message);
      if (e.code === 'auth/requires-recent-login') {
        setMustReauth(true);
      }
    });
    await doDeleteProfile(profile.docId).catch(e => {
      setError(e.message);
    });
  };

  const reauthHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pass = (e.target[0] as HTMLInputElement).value;
    const credential: EmailAuthCredential = getCredential(pass) as EmailAuthCredential;
    const reauthRes = await doReauthenticate(credential).catch(e => setError(e.message));
    if (reauthRes) {
      await doDeleteUser().catch(e => setError(e.message));
    }
  };

  return (
    <>
      {!isSure ? (
        <button onClick={() => setIsSure(true)}>Delete user</button>
      ) : (
        <button disabled={mustReauth} className="warning" onClick={deleteHandler}>
          DELETE USER
        </button>
      )}
      {mustReauth ? (
        <form onSubmit={reauthHandler}>
          <legend>You must reauthenticate your account</legend>
          <label htmlFor="pass"></label>
          <input type="password" placeholder="password" />
          <button type="submit">Submit</button>
        </form>
      ) : null}
      {error && <p>{error}</p>}
    </>
  );
};

export default DeleteUser;
