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
    <nav className="navbar">
        <ul>
            <NavLink link={ROUTES.LANDING}>Landing</NavLink>
            <NavLink link={ROUTES.USER_LIST}>
                Administrate Users
            </NavLink>
            <NavLink link={ROUTES.ROLES}>Manage Roles</NavLink>
            <NavLink link={ROUTES.ACCOUNT}>Account</NavLink>
            <li className="navbar__element">
                <SignOutButton className="navbar__link" />
            </li>
        </ul>
    </nav>
);

const NavigationNonAuth = () => (
    <nav className="navbar">
        <ul>
            <NavLink link={ROUTES.LANDING}>Landing</NavLink>
            <NavLink link={ROUTES.SIGN_IN}>Sign In</NavLink>
        </ul>
    </nav>
);

const NavLink = props => (
    <li className="navbar__element">
        <Link className="navbar__link" to={props.link}>
            {props.children}
        </Link>
    </li>
);

export default withAuthUser(Navigation);
