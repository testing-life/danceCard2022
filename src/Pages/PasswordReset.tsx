import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordReset from '../Components/PasswordReset/PasswordReset.component';

export const PasswordResetPage: FC = () => {
  const navigate = useNavigate();

    return (
    <>
    <PasswordReset />
    <br />
    <button onClick={() => navigate(-1)}>Go back</button>
    </>
  );
};
