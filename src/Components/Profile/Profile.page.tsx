import React, { FC, FunctionComponent } from 'react';
import ProfileFormComponent from './Profile.form.component';
import ProfileCredentialsChangeComponent from './Profile.credentialsChange.component';

const Profile: FC = () => {
  return (
    <>
      <ProfileFormComponent />
      {/* <ProfileCredentialsChangeComponent /> */}
    </>
  );
};

export default Profile;
