import React, { useState } from 'react';

import useFirebase from 'hooks/useFirebase';
import { withAuthorization } from './Session';

const PasswordChangeForm = () => {
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState(null);

  const firebase = useFirebase();

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase.doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswordOne('');
        setPasswordTwo('');
        setError(null);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return (
    <form onSubmit={handleSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={e => setPasswordOne(e.target.value)}
          type="password"
          placeholder="Nytt passord"
        />

        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={e => setPasswordTwo(e.target.value)}
          type="password"
          placeholder="Bekreft nytt passord"
        />

        <button disabled={isInvalid} type="submit" className="btn">
          Endre passord
        </button>

        {error && <p>{error.message}</p>}
      </form>
  )
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(PasswordChangeForm);
