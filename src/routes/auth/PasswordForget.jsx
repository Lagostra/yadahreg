import useFirebase from 'hooks/useFirebase';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div className="password-forget__container">
    <h1>YadahReg</h1>
    <h2>Glemt passord</h2>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const firebase = useFirebase();

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail('');
        setError(null);
      })
      .catch((error) => {
        setError(error);
      });
  }

  const isInvalid = email === '';

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="E-Post" />

      <button disabled={isInvalid} type="submit" className="password-forget__submit">
        Tilbakestill passord
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Glemt passord?</Link>
  </p>
);

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };
