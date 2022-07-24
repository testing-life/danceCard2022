import React, { FC, FunctionComponent } from 'react';
import ProfileFormComponent from './Profile.form.component';
import PasswordReset from '../PasswordReset/PasswordReset.component';

const Profile: FC = () => {
  return (
    <>
      <ProfileFormComponent />
      <PasswordReset />
    </>
  );
};

export default Profile;
