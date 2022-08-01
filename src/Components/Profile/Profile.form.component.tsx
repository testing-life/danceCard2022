import React, { useState, FC, ChangeEvent } from 'react';
import { useProfile } from '../../Contexts/profile.context';
import { Profile } from '../../Models/profile.models';
import { Dance, DanceName } from '../../Constants/dances';
import './Profile.form.component.css';

const ProfileFormComponent: FC = () => {
  const [formData, setFormData] = useState<Profile>({} as Profile);
  const [updating, setUpdating] = useState(false);
  const { profile, updateProfile, profileError } = useProfile();

  const updateDanceObj = (e: ChangeEvent<HTMLInputElement>, position: keyof Dance) => {
    if (!profile) {
      return;
    }
    const { name, checked } = e.target;
    const danceObj = profile.dances[name as DanceName];
    // TODO fix obj indexing with keyof
    (danceObj as any)[position] = checked;
    const dances = { ...profile.dances, [name]: danceObj };
    setFormData({ ...formData, dances });
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <>
      {profile && (
        <>
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
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, [e.target.name]: e.target.value })
                    }
                  />
                </label>
              </li>
              {!!Object.keys(profile).length &&
                Object.entries(profile.dances).map((dance: any, index: number) => {
                  const danceName: DanceName = dance[0];
                  const positionsObj: Dance = dance[1];
                  return (
                    <li key={index} className={`danceItem`}>
                      <b className="">{danceName}</b>
                      <div className="">
                        <label htmlFor={`${danceName}-lead`}>
                          <span>Lead</span>
                          <input
                            type="checkbox"
                            name={danceName}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => updateDanceObj(e, 'lead')}
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
                            onInput={(e: ChangeEvent<HTMLInputElement>) => updateDanceObj(e, 'follow')}
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
        </>
      )}
      {profileError && <p>{profileError}</p>}
      {updating && <p>...updating</p>}
    </>
  );
};
export default ProfileFormComponent;
