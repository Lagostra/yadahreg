import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';

import Navigation from './components/Navigation';
import LandingPage from './routes/LandingPage';

import SignIn from './routes/auth/SignIn';
import SignUp from './routes/auth/SignUp';
import PasswordForget from './routes/auth/PasswordForget';
import AccountPage from './routes/auth/Account';

import UserList from './routes/admin/UserList';
import EditUser from './routes/admin/EditUser';
import Roles from './routes/admin/Roles';

const App = () => (
    <Router>
        <Navigation />

        <div className="content-wrapper">
            <Route
                exact
                path={ROUTES.LANDING}
                component={LandingPage}
            />
            <Route path={ROUTES.SIGN_IN} component={SignIn} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForget}
            />
            <Route
                exact
                path={ROUTES.USER_LIST}
                component={UserList}
            />
            <Route
                path={ROUTES.USER_EDIT + '/:userUid'}
                component={props => (
                    <EditUser
                        userUid={props.match.params.userUid}
                        {...props}
                    />
                )}
            />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ROLES} component={Roles} />
        </div>
    </Router>
);

export default withAuthentication(App);
