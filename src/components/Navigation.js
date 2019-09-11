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
            activeSubDrawer: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                navDrawerActive: false,
                activeSubDrawer: '',
            });
        }
    }

    handleActivateSubDrawer = name => {
        this.setState({ activeSubDrawer: name });
    };

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
                                activeSubDrawer: '',
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
                        activeSubDrawer={this.state.activeSubDrawer}
                        onActivateSubDrawer={
                            this.handleActivateSubDrawer
                        }
                    />
                ) : (
                    <NavigationNonAuth
                        active={this.state.navDrawerActive}
                        activeSubDrawer={this.state.activeSubDrawer}
                        onActivateSubDrawer={
                            this.handleActivateSubDrawer
                        }
                    />
                )}
            </nav>
        );
    }
}

const NavigationAuth = ({
    authUser,
    active,
    activeSubDrawer,
    onActivateSubDrawer,
}) => (
    <ul
        className={`navbar__drawer ${
            active ? 'navbar__drawer--active' : ''
        }`}
    >
        <NavLink link={ROUTES.REGISTRATION}>Registrering</NavLink>
        <NavLink link={ROUTES.MEMBERS}>Medlemmer</NavLink>
        <NavSubDrawer
            title="Admin"
            active={activeSubDrawer === 'Admin'}
            onActivateSubDrawer={onActivateSubDrawer}
        >
            <NavLink link={ROUTES.USER_LIST}>Brukere</NavLink>
            <NavLink link={ROUTES.ROLES}>Roller</NavLink>
        </NavSubDrawer>
        <NavLink link={ROUTES.ACCOUNT}>Min Bruker</NavLink>
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

class NavSubDrawer extends React.Component {
    handleClick = () => {
        if (this.props.active) {
            this.props.onActivateSubDrawer('');
        } else {
            this.props.onActivateSubDrawer(this.props.title);
        }
    };

    render() {
        return (
            <li className="navbar__subdrawer-container">
                <span className="navbar__element">
                    <button
                        className={`navbar__link navbar__subdrawer-link ${
                            this.props.active
                                ? 'navbar__subdrawer-link--active'
                                : ''
                        }`}
                        onClick={this.handleClick}
                    >
                        {this.props.title}
                        <i
                            className={`navbar__subdrawer-caret-down fas ${
                                this.props.active
                                    ? 'fa-caret-down'
                                    : 'fa-caret-right'
                            }`}
                        />
                        <i
                            className={`navbar__subdrawer-caret-left fas ${
                                this.props.active
                                    ? 'fa-caret-left'
                                    : 'fa-caret-right'
                            }`}
                        />
                    </button>
                </span>

                <ul
                    className={`navbar__subdrawer ${
                        this.props.active
                            ? 'navbar__subdrawer--active'
                            : ''
                    }`}
                >
                    {this.props.children}
                </ul>
            </li>
        );
    }
}

export default compose(
    withAuthUser,
    withRouter,
)(Navigation);
