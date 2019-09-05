import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';

import Navigation from './components/Navigation';
import LandingPage from './routes/LandingPage';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import PasswordForget from './routes/PasswordForget';
import PasswordChange from './routes/PasswordChange';
import Admin from './routes/Admin';

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
        <Route
            path={ROUTES.PASSWORD_CHANGE}
            component={PasswordChange}
        />
        <Route path={ROUTES.ADMIN} component={Admin} />
    </Router>
);

export default withAuthentication(App);
