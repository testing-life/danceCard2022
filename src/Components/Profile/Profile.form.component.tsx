import React, { FunctionComponent, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Collections } from '../../Constants/collections';
import { auth, query, db, collection, getDocs, updateDoc, where, doc } from '../../Firebase/firebase';
import { Profile } from '../../Models/profile.models';
import './Profile.form.component.css';

const ProfileFormComponent: FunctionComponent = () => {
  const [profile, setProfile] = useState<any>();
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [user, loading, authError] = useAuthState(auth);
  const [localError, setLocalError] = useState();

  useEffect(() => {
    const setLocalProfile = async () => {
      const res = await getUserProfile();
      if (res) {
        setProfile(res);
        setFormData(res);
      }
    };
    if (!loading && user) {
      setLocalProfile();
    }
  }, [loading, user]);

  const getUserProfile = async () => {
    const q = query(collection(db, Collections.Users), where('uid', '==', user?.uid));
    const doc = await getDocs(q).catch(e => setLocalError(e.message));
    return doc ? { ...doc.docs[0].data(), docId: doc?.docs[0].id } : null;
  };

  const updateDanceObj = (e: any, position: string) => {
    const name = e.target.name;
    const value = e.target.checked;
    const danceObj = profile.dances[name];
    danceObj[position] = value;
    const dances = { ...profile.dances, [name]: danceObj };
    setFormData({ ...formData, dances });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setUpdating(true);
    const userRef = doc(db, Collections.Users, profile.docId);
    if (userRef) {
      await updateDoc(userRef, formData)
        .catch(e => setLocalError(e.message))
        .finally(() => setUpdating(false));
      getUserProfile();
    }
  };

  return (
    <>
      {profile && (
        <form onSubmit={onSubmit}>
          <legend>Profile</legend>
          <ul>
            <li>
              <label>
                User name
                <input
                  type="text"
                  defaultValue={profile.username}
                  placeholder="username"
                  name="username"
                  onInput={(e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                />
              </label>
            </li>
            <li>
              <label>
                Active
                <input
                  type="checkbox"
                  defaultChecked={profile.active}
                  name="active"
                  onInput={(e: any) => setFormData({ ...formData, [e.target.name]: e.target.checked })}
                />
              </label>
            </li>
            {!!Object.keys(profile).length &&
              Object.entries(profile.dances).map((dance: any, index: number) => {
                const danceName: string = dance[0];
                const positionsObj: any = dance[1];
                return (
                  <li key={index} className={`danceItem`}>
                    <b className="">{danceName}</b>
                    <div className="">
                      <label htmlFor={`${danceName}-lead`}>
                        <span>Lead</span>
                        <input
                          type="checkbox"
                          name={danceName}
                          onInput={(e: any) => updateDanceObj(e, 'lead')}
                          id={`${danceName}-lead`}
                          defaultChecked={positionsObj.lead}
                        />
                      </label>
                    </div>
                    <div className="">
                      <label htmlFor={`${danceName}-follow`}>
                        <span>Follow</span>
                        <input
                          type="checkbox"
                          name={danceName}
                          onInput={(e: any) => updateDanceObj(e, 'follow')}
                          id={`${danceName}-follow`}
                          defaultChecked={positionsObj.follow}
                        />
                      </label>
                    </div>
                  </li>
                );
              })}
          </ul>
          <button type="submit">Update</button>
        </form>
      )}
      {localError && <p>{localError}</p>}
      {updating && <p>...updating</p>}
    </>
  );
};
export default ProfileFormComponent;
