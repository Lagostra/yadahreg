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
import InactiveMembers from './routes/InactiveMembers';
import TopList from './routes/TopList';
import MailingList from './routes/MailingList';
import AttendanceOverview from './routes/AttendanceOverview';
import Allergies from './routes/Allergies';

const App = props => {
    const showNavigation = !!props.authUser;
    const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
    const isProd = process.env.NODE_ENV === 'production';
    const prodOnLocal = isLocal && isProd;

    if (isLocal) {
        document.title = 'YadahReg - Localhost';
    } else if (!isProd) {
        document.title = 'YadahReg - Testing';
    }

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
                <Route
                    path={ROUTES.INACTIVE_MEMBERS}
                    component={InactiveMembers}
                />
                <Route
                    path={ROUTES.MAILING_LIST}
                    component={MailingList}
                />
                <Route path={ROUTES.TOP_LIST} component={TopList} />
                <Route
                    path={ROUTES.ATTENDANCE_OVERVIEW}
                    component={AttendanceOverview}
                />
                <Route
                    path={ROUTES.ALLERGIES}
                    component={Allergies}
                />
            </div>
        </Router>
    );
};

export default compose(withAuthentication, withAuthUser)(App);
