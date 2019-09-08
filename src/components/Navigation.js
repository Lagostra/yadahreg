import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import SignOutButton from './SignOutButton';
import * as ROUTES from '../constants/routes';
import { withAuthUser } from './Session';
import { compose } from 'recompose';

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navDrawerActive: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({ navDrawerActive: false });
        }
    }

    render() {
        return (
            <nav className="navbar">
                <div className="navbar__top-wrapper">
                    <Link
                        to={ROUTES.LANDING}
                        className="navbar__logo"
                    >
                        YadahReg
                    </Link>
                    <button
                        className="navbar__hamburger-menu"
                        onClick={() =>
                            this.setState({
                                navDrawerActive: !this.state
                                    .navDrawerActive,
                            })
                        }
                    >
                        <i className="fas fa-bars" />
                    </button>
                </div>
                {this.props.authUser ? (
                    <NavigationAuth
                        authUser={this.props.authUser}
                        active={this.state.navDrawerActive}
                    />
                ) : (
                    <NavigationNonAuth
                        active={this.state.navDrawerActive}
                    />
                )}
            </nav>
        );
    }
}

const NavigationAuth = ({ authUser, active }) => (
    <ul
        className={`navbar__drawer ${
            active ? 'navbar__drawer--active' : ''
        }`}
    >
        <NavLink link={ROUTES.USER_LIST}>Administrate Users</NavLink>
        <NavLink link={ROUTES.ROLES}>Manage Roles</NavLink>
        <NavLink link={ROUTES.ACCOUNT}>Account</NavLink>
        <li className="navbar__element">
            <SignOutButton buttonClass="navbar__link" />
        </li>
    </ul>
);

const NavigationNonAuth = ({ active }) => (
    <ul
        className={`navbar__drawer ${
            active ? 'navbar__drawer--active' : ''
        }`}
    >
        {/*<NavLink link={ROUTES.SIGN_IN}>Sign In</NavLink>*/}
    </ul>
);

const NavLink = props => (
    <li className="navbar__element">
        <Link className="navbar__link" to={props.link}>
            {props.children}
        </Link>
    </li>
);

export default compose(
    withAuthUser,
    withRouter,
)(Navigation);
