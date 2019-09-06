import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';

import Navigation from './components/Navigation';
import LandingPage from './routes/LandingPage';
import SignIn from './routes/auth/SignIn';
import SignUp from './routes/auth/SignUp';
import PasswordForget from './routes/auth/PasswordForget';
import PasswordChange from './routes/auth/PasswordChange';
import UserList from './routes/admin/UserList';
import UserInfo from './routes/UserInfo';
import EditUser from './routes/admin/EditUser';

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
        <Route exact path={ROUTES.USER_LIST} component={UserList} />
        <Route
            path={ROUTES.USER_EDIT}
            component={props => (
                <EditUser
                    userUid={props.match.params.userUid}
                    {...props}
                />
            )}
        />
        <Route path={ROUTES.USER_INFO} component={UserInfo} />
    </Router>
);

export default withAuthentication(App);
