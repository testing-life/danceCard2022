import React, { useState, FC } from 'react';
import { useProfile } from '../../Contexts/profile.context';
import './Profile.form.component.css';

const ProfileFormComponent: FC = () => {
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const { profile, updateProfile, profileError } = useProfile();

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
    updateProfile(formData);
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
      {profileError && <p>{profileError}</p>}
      {updating && <p>...updating</p>}
    </>
  );
};
export default ProfileFormComponent;
