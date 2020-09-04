import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import moment from 'moment';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthUser } from '../../components/Session';
import Spinner from '../../components/Spinner';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loggingIn: false, error: '' };
  }

  componentDidMount() {
    if (window.localStorage.hasOwnProperty('login_redirect')) {
      const loginRedirect = JSON.parse(window.localStorage['login_redirect']);
      if (moment() < moment(loginRedirect['timeout'])) this.setState({ loggingIn: true });
      this.props.firebase.auth
        .getRedirectResult()
        .then(() => {
          this.props.history.push(ROUTES.HOME);
          this.setState({ loggingIn: false });
        })
        .catch((error) => {
          this.setState({ loggingIn: false, error });
        });
      window.localStorage.removeItem('login_redirect');
    }
  }

  render() {
    const { loggingIn, error } = this.state;
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
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    if (this.props.authUser) {
      this.props.history.push(ROUTES.HOME);
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input name="email" value={email} onChange={this.onChange} type="text" placeholder="E-post" />
        <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Passord" />

        <PasswordForgetLink />

        <button disabled={isInvalid} type="submit" className="signin__submit">
          Logg inn
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase, withAuthUser)(SignInFormBase);

class SignInGoogleBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = (event) => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" className="signin__social signin__social-google">
          Logg inn med Google
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

class SignInFacebookBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = (event) => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" className="signin__social signin__social-facebook">
          Logg inn med Facebook
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase);

export default compose(withFirebase, withRouter)(SignInPage);

export { SignInForm, SignInGoogle, SignInFacebook };
