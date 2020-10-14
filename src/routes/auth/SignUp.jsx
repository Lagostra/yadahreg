import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { SignInGoogle, SignInFacebook } from './SignIn';
import { useAuthUser, useFirebase } from 'hooks';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpPage = () => (
  <div className="signup__container">
    <h1>YadahReg</h1>
    <h2>Registrer deg</h2>
    <SignUpForm />
    <SignInGoogle />
    <SignInFacebook />
  </div>
);

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState(null);

  const authUser = useAuthUser();
  const history = useHistory();
  const firebase = useFirebase();

  if (authUser) {
    history.push(ROUTES.HOME);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        setTimeout(() => {
          firebase.user(authUser.user.uid).child('name').set(name);
        }, 1000);
      })
      .then(() => {
        setName('');
        setEmail('');
        setPasswordOne('');
        setPasswordTwo('');
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      })
  }

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || name === '';

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Fullt navn" />
      <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="E-post" />
      <input name="passwordOne" value={passwordOne} onChange={e => setPasswordOne(e.target.value)} type="password" placeholder="Passord" />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={e => setPasswordTwo(e.target.value)}
        type="password"
        placeholder="Bekreft passord"
      />

      <button type="submit" disabled={isInvalid} className="signup__submit">
        Registrer
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const SignUpLink = () => (
  <p>
    Har du ikke bruker? <Link to={ROUTES.SIGN_UP}>Registrer deg</Link>
  </p>
);

export default SignUpPage;
export { SignUpForm, SignUpLink };
