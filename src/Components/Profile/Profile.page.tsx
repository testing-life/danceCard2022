import React, { FC } from 'react';
import ProfileFormComponent from './Profile.form.component';
import PasswordReset from '../PasswordReset/PasswordReset.component';
import DeleteUser from '../DeleteUser/DeleteUser.component';

const Profile: FC = () => {
  return (
    <>
      <ProfileFormComponent />
      <PasswordReset />
      <DeleteUser />
    </>
  );
};

export default Profile;
