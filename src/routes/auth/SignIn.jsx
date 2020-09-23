import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import * as ROUTES from '../../constants/routes';
import Spinner from '../../components/Spinner';
import { useFirebase } from 'hooks';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const SignInPage = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');
  
  const history = useHistory();
  const firebase = useFirebase();

  useEffect(() => {
    if (window.localStorage.hasOwnProperty('login_redirect')) {
      const loginRedirect = JSON.parse(window.localStorage['login_redirect']);
      if (moment() < moment(loginRedirect['timeout'])) {
        setLoggingIn(true);
      }

      firebase.auth.getRedirectResult()
        .then(() => {
          history.push(ROUTES.HOME);
          setLoggingIn(false);
        })
        .catch(error => {
          setLoggingIn(false);
          setError(error);
        })
      window.localStorage.removeItem('login_redirect');
    }
  }, [firebase, history])

  return (
    <div className="signin__container">
      <h1>YadahReg</h1>
      <h2>{loggingIn ? 'Logger inn...' : 'Logg inn'}</h2>
      {error && <p>{error}</p>}
      {loggingIn && <Spinner />}
      {!loggingIn && (
        <React.Fragment>
          <SignInForm />
          <SignInGoogle />
          <SignInFacebook />
          <SignUpLink />
        </React.Fragment>
      )}
    </div>
  );
}

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const firebase = useFirebase();
  const history = useHistory();

  const isInvalid = password === '' || email === '';

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="E-post" />
      <input name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Passord" />

      <PasswordForgetLink />

      <button disabled={isInvalid} type="submit" className="signin__submit">
        Logg inn
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const SignInGoogle = () => {
  const [error, setError] = useState(null);

  const firebase = useFirebase();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase.doSignInWithGoogle()
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="signin__social signin__social-google">
        Logg inn med Google
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const SignInFacebook = () => {
  const [error, setError] = useState(null);

  const firebase = useFirebase();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    firebase.doSignInWithFacebook()
      .then(() => {
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

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="signin__social signin__social-facebook">
        Logg inn med Facebook
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook };
