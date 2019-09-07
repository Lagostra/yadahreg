import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOutButton';
import * as ROUTES from '../constants/routes';
import { withAuthUser } from './Session';

const Navigation = ({ authUser }) => (
    <div>
        {authUser ? (
            <NavigationAuth authUser={authUser} />
        ) : (
            <NavigationNonAuth />
        )}
    </div>
);

const NavigationAuth = ({ authUser }) => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.USER_LIST}>Administrate Users</Link>
            </li>
            <li>
                <Link to={ROUTES.ROLES}>Manage Roles</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
                <SignOutButton />
            </li>
        </ul>
    </div>
);

const NavigationNonAuth = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            </li>
        </ul>
    </div>
);

export default withAuthUser(Navigation);
