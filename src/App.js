import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';

import Navigation from './components/Navigation';
import LandingPage from './views/LandingPage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import PasswordForget from './views/PasswordForget';

const App = () => (
    <Router>
        <Navigation />

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
        <Route
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForget}
        />
    </Router>
);

export default withAuthentication(App);
