import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withAuthUser } from '../../components/Session';
import PasswordChangeForm from '../../components/PasswordChange';
import { withFirebase } from '../../components/Firebase';

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

class Account extends React.Component {
  render() {
    const { authUser } = this.props;

    return (
      <div className="content">
        <h1>{this.props.authUser.name}</h1>
        <p>
          <strong>E-post:</strong> {this.props.authUser.email}
        </p>
        <PasswordChangeForm />
        <LoginManagement authUser={authUser} />
      </div>
    );
  }
}

class LoginManagementBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) => {
        this.setState({ activeSignInMethods, error: null });
      })
      .catch((error) => this.setState({ error }));
  };

  onSocialLoginLink = (provider) => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onUnlink = (providerId) => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onDefaultLoginLink = (password) => {
    const credential = this.props.firebase.emailAuthProvider.credential(this.props.authUser.email, password);

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

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
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
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
}

const LoginManagement = withFirebase(LoginManagementBase);

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

class DefaultLoginToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { passwordOne: '', passwordTwo: '' };
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: '', passwordTwo: '' });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return isEnabled ? (
      <button type="button" onClick={() => onUnlink(signInMethod.id)} disabled={onlyOneLeft} className="btn">
        Deaktiver {signInMethod.title}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Nytt passord"
        />

        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Bekreft nytt passord"
        />

        <button disabled={isInvalid} type="submit" className="btn">
          Link {signInMethod.title}
        </button>
      </form>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default compose(withAuthorization(authCondition), withAuthUser)(Account);