import React, { ChangeEvent, FC, useState } from 'react';
import { doPasswordReset } from '../../Firebase/firebase';
import './PasswordReset.component.css';

const PasswordReset: FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const address = (e.target[0] as HTMLInputElement).value;
    await doPasswordReset(address)
      .catch((e: Error) => setError(e.message))
      .finally(() => setSuccess('Password reset email sent'));
  };

  return (
    <>
      <form className="passwordResetForm" onSubmit={resetHandler}>
        <label className="passwordResetForm__label" htmlFor="resetEmailField">
          Reset password
        </label>
        <input
          type="email"
          id="resetEmailField"
          name="resetEmail"
          className="passwordResetForm__input"
          required
          placeholder="Email address for reset link"
        />
        <button type="submit">Reset password</button>
      </form>
      {error && <p>{error}</p>}
      {!error && success && <p>{success}</p>}
    </>
  );
};

export default PasswordReset;
