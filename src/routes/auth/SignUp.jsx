import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthUser } from '../../components/Session';
import { SignInGoogle, SignInFacebook } from './SignIn';

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

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    if (this.props.authUser) {
      this.props.history.push(ROUTES.HOME);
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    const { name, email, passwordOne } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        setTimeout(() => {
          this.props.firebase.user(authUser.user.uid).child('name').set(name);
        }, 1000);
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { name, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || name === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input name="name" value={name} onChange={this.onChange} type="text" placeholder="Fullt navn" />
        <input name="email" value={email} onChange={this.onChange} type="text" placeholder="E-post" />
        <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Passord" />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
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
}

const SignUpLink = () => (
  <p>
    Har du ikke bruker? <Link to={ROUTES.SIGN_UP}>Registrer deg</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase, withAuthUser)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };