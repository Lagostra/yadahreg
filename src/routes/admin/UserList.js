import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import * as PERMISSIONS from '../../constants/permissions';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../../components/Firebase';
import { withAuthorization } from '../../components/Session';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                <h1>Admin</h1>

                {loading && <div>Loading...</div>}

                <UsersList users={users} />
            </div>
        );
    }
}

const UsersList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>ID</strong> {user.uid}
                </span>
                <span>
                    <strong>E-Mail:</strong> {user.email}
                </span>
                <span>
                    <strong>Name:</strong> {user.name}
                </span>
                <span>
                    <Link to={ROUTES.USER_EDIT + '/' + user.uid}>
                        Edit
                    </Link>
                </span>
            </li>
        ))}
    </ul>
);

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.USERS_READ];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(AdminPage);