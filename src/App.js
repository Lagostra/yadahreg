import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from './constants/routes';
import {
    withAuthentication,
    withAuthUser,
} from './components/Session';

import Navigation from './components/Navigation';
import Home from './routes/Home';

import SignIn from './routes/auth/SignIn';
import SignUp from './routes/auth/SignUp';
import PasswordForget from './routes/auth/PasswordForget';
import AccountPage from './routes/auth/Account';

import UserList from './routes/admin/UserList';
import Roles from './routes/admin/Roles';

import Members from './routes/Members';
import Registration from './routes/Registration';
import Payment from './routes/Payment';
import DataExport from './routes/DataExport';

const App = props => {
    const showNavigation = !!props.authUser;
    const prodOnLocal =
        process.env.NODE_ENV === 'production' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');

    return (
        <Router>
            <div
                className={`top-bar ${
                    showNavigation ? '' : 'hidden'
                }`}
            >
                <Navigation />
            </div>
            <div className="content-wrapper">
                {prodOnLocal && (
                    <span
                        style={{ fontWeight: 'bold', color: 'red' }}
                    >
                        You are running against the production
                        environment on localhost! For development, the
                        testing environment should be used to avoid
                        accidental data corruption or loss.
                    </span>
                )}

                <Route exact path={ROUTES.LANDING} component={Home} />
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
                    path={ROUTES.ACCOUNT}
                    component={AccountPage}
                />
                <Route path={ROUTES.ROLES} component={Roles} />
                <Route path={ROUTES.MEMBERS} component={Members} />
                <Route
                    path={ROUTES.REGISTRATION}
                    component={Registration}
                />
                <Route path={ROUTES.PAYMENT} component={Payment} />
                <Route
                    path={ROUTES.DATA_EXPORT}
                    component={DataExport}
                />
            </div>
        </Router>
    );
};

export default compose(
    withAuthentication,
    withAuthUser,
)(App);
