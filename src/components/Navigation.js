import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import SignOutButton from './SignOutButton';
import * as ROUTES from '../constants/routes';
import * as PERMISSIONS from '../constants/permissions';
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
        const isTest =
            !process.env.REACT_APP_ENVIRONMENT ||
            process.env.REACT_APP_ENVIRONMENT === 'development' ||
            process.env.REACT_APP_ENVIRONMENT === 'test';

        return (
            <nav className="navbar">
                <div className="navbar__top-wrapper">
                    <Link
                        to={ROUTES.LANDING}
                        className="navbar__logo"
                    >
                        YadahReg
                        {isTest && ' - '}
                        {isTest && (
                            <span
                                style={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                }}
                            >
                                Testing
                            </span>
                        )}
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
        {authUser.permissions[PERMISSIONS.EVENTS_WRITE] && (
            <NavLink link={ROUTES.REGISTRATION}>Registrering</NavLink>
        )}
        {authUser.permissions[PERMISSIONS.SEMESTERS_WRITE] && (
            <NavLink link={ROUTES.PAYMENT}>Betaling</NavLink>
        )}
        {authUser.permissions[PERMISSIONS.MEMBERS_WRITE] && (
            <NavLink link={ROUTES.MEMBERS}>Medlemmer</NavLink>
        )}
        <NavSubDrawer
            title="Verktøy"
            active={activeSubDrawer === 'Verktøy'}
            onActivateSubDrawer={onActivateSubDrawer}
        >
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] && (
                <NavLink link={ROUTES.MAILING_LIST}>
                    Mailliste
                </NavLink>
            )}
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
                authUser.permissions[PERMISSIONS.EVENTS_READ] && (
                    <NavLink link={ROUTES.ATTENDANCE_OVERVIEW}>
                        Oppmøte
                    </NavLink>
                )}
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
                authUser.permissions[PERMISSIONS.EVENTS_READ] && (
                    <NavLink link={ROUTES.INACTIVE_MEMBERS}>
                        Inaktive medlemmer
                    </NavLink>
                )}
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] && (
                <NavLink link={ROUTES.ALLERGIES}>Allergier</NavLink>
            )}
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
                authUser.permissions[PERMISSIONS.EVENTS_READ] &&
                authUser.permissions[PERMISSIONS.SEMESTERS_READ] && (
                    <NavLink link={ROUTES.TOP_LIST}>
                        Toppliste
                    </NavLink>
                )}
            {authUser.permissions[PERMISSIONS.SEMESTERS_READ] &&
                authUser.permissions[PERMISSIONS.EVENTS_READ] && (
                    <NavLink link={ROUTES.SEMESTER_STATISTICS}>
                        Semesterstatistikk
                    </NavLink>
                )}
            {authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
                authUser.permissions[PERMISSIONS.EVENTS_READ] &&
                authUser.permissions[PERMISSIONS.SEMESTERS_READ] && (
                    <NavLink link={ROUTES.DATA_EXPORT}>
                        Eksporter data
                    </NavLink>
                )}
        </NavSubDrawer>
        <NavSubDrawer
            title="Admin"
            active={activeSubDrawer === 'Admin'}
            onActivateSubDrawer={onActivateSubDrawer}
        >
            {authUser.permissions[PERMISSIONS.USERS_WRITE] && (
                <NavLink link={ROUTES.USER_LIST}>Brukere</NavLink>
            )}
            {authUser.permissions[PERMISSIONS.ROLES_WRITE] && (
                <NavLink link={ROUTES.ROLES}>Roller</NavLink>
            )}
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
        const shouldRender =
            this.props.children &&
            (!Array.isArray(this.props.children) ||
                this.props.children.reduce(
                    (prev, cur) => prev || cur,
                ));

        if (!shouldRender) {
            return null;
        }

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

export default compose(withAuthUser, withRouter)(Navigation);
