import React, { useCallback, useEffect, useState } from 'react';

import { withAuthorization } from '../../components/Session';
import PasswordChangeForm from '../../components/PasswordChange';
import useAuthUser from 'hooks/useAuthUser';
import useFirebase from 'hooks/useFirebase';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    title: 'Passord',
    provider: null,
  },
  {
    id: 'google.com',
    title: 'Google',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    title: 'Facebook',
    provider: 'facebookProvider',
  },
];

const Account = () => {
  const authUser = useAuthUser();

  return (
    <div className="content">
      <h1>{authUser.name}</h1>
      <p>
        <strong>E-post:</strong> {authUser.email}
      </p>
      <PasswordChangeForm />
      <LoginManagement authUser={authUser} />
    </div>
  );
}

const LoginManagement = () => {
  const [activeSignInMethods, setActiveSignInMethods] = useState([]);
  const [error, setError] = useState(null);
  const firebase = useFirebase();
  const authUser = useAuthUser();

  const fetchSignInMethods = useCallback(() => {
    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then((activeSignInMethods) => {
        setActiveSignInMethods(activeSignInMethods); 
        setError(null);
      })
      .catch((error) => setError(error));
  }, [firebase, authUser]);
  
  useEffect(() => {
    fetchSignInMethods();
  }, [fetchSignInMethods]);

  const onSocialLoginLink = (provider) => {
    firebase.auth.currentUser
      .linkWithPopup(firebase[provider])
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  const onUnlink = (providerId) => {
    firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  const onDefaultLoginLink = (password) => {
    const credential = firebase.emailAuthProvider.credential(authUser.email, password);

    firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  return (
    <div>
      <br />
      <h1>Innloggingsmetoder:</h1>
      <ul>
        {SIGN_IN_METHODS.map((signInMethod) => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);

          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
}

const SocialLoginToggle = ({ onlyOneLeft, isEnabled, signInMethod, onLink, onUnlink }) =>
  isEnabled ? (
    <button type="button" onClick={() => onUnlink(signInMethod.id)} disabled={onlyOneLeft} className="btn">
      Deaktiver {signInMethod.title}
    </button>
  ) : (
    <button type="button" onClick={() => onLink(signInMethod.provider)} className="btn">
      Link {signInMethod.title}
    </button>
  );

const DefaultLoginToggle = ({ onLink, onUnlink, onlyOneLeft, signInMethod, isEnabled }) => {
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    onLink(passwordOne);
    setPasswordOne('');
    setPasswordTwo('');
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return isEnabled ? (
    <button type="button" onClick={() => onUnlink(signInMethod.id)} disabled={onlyOneLeft} className="btn">
      Deaktiver {signInMethod.title}
    </button>
  ) : (
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
        Link {signInMethod.title}
      </button>
    </form>
  );
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Account);
