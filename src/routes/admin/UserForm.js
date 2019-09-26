import React from 'react';
import { withFirebase } from '../../components/Firebase';

import { compose } from 'recompose';
import { withAuthUser } from '../../components/Session';
import * as PERMISSIONS from '../../constants/permissions';

class UserForm extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            role: '',
            ...props.user,
            availableRoles: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                name: '',
                email: '',
                role: '',
                ...this.props.user,
            });
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const { userUid } = this.props;
        this.userUid = userUid;
        /*this.props.firebase
            .user(userUid)
            .once('value')
            .then(snapshot => {
                if (this._isMounted) {
                    const user = snapshot.val();
                    this.setState({ ...user });
                }
            });*/

        this.props.firebase
            .roles()
            .once('value')
            .then(snapshot => {
                if (this._isMounted) {
                    const roleObject = snapshot.val();
                    const roles = Object.keys(roleObject).map(
                        key => ({ ...roleObject[key], name: key }),
                    );
                    this.setState({ availableRoles: roles });
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSubmit = e => {
        e.preventDefault();

        const { name, email, role } = this.state;
        const user = { name, email, role };
        this.props.firebase.user(this.state.uid).set(user);
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { name, email, role, availableRoles } = this.state;
        const { authUser } = this.props;

        const restrictedRoles = availableRoles
            .filter(r => r.restricted)
            .map(r => r.name);
        console.log(restrictedRoles);

        return (
            <form onSubmit={this.onSubmit}>
                <h1>Endre bruker</h1>
                <label htmlFor="name">Navn</label>
                <input
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />

                <label htmlFor="email">E-post</label>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />

                <label htmlFor="role">Rolle</label>
                <select
                    value={role}
                    onChange={this.onChange}
                    name="role"
                    disabled={
                        restrictedRoles.includes(role) &&
                        !authUser.permissions[
                            PERMISSIONS.SET_RESTRICTED_ROLES
                        ]
                    }
                >
                    <option
                        value=""
                        title="Ingen rolle - brukeren vil ikke ha tilgang til noen funksjoner."
                    >
                        Ingen rolle
                    </option>
                    {availableRoles.map(r => (
                        <option
                            value={r.name}
                            key={r.name}
                            title={r.description}
                            disabled={
                                r.restricted &&
                                !authUser.permissions[
                                    PERMISSIONS.SET_RESTRICTED_ROLES
                                ]
                            }
                        >
                            {r.name}
                        </option>
                    ))}
                </select>

                <button className="btn" type="submit">
                    Lagre
                </button>
            </form>
        );
    }
}

export default compose(
    withFirebase,
    withAuthUser,
)(UserForm);
