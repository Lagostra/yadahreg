import React from 'react';
import { withFirebase } from '../../components/Firebase';

const INITIAL_STATE = {
    name: '',
    email: '',
    role: '',
    availableRoles: [],
};

class EditUser extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        this._isMounted = true;
        const { userUid } = this.props;
        this.props.firebase
            .user(userUid)
            .once('value')
            .then(snapshot => {
                if (this._isMounted) {
                    const user = snapshot.val();
                    this.setState({ ...user });
                }
            });

        this.props.firebase
            .roles()
            .once('value')
            .then(snapshot => {
                if (this._isMounted) {
                    const roles = Object.keys(snapshot.val());
                    this.setState({ availableRoles: roles });
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSubmit() {}

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { name, email, role, availableRoles } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <h2>Edit User</h2>
                <label htmlFor="name">Name</label>
                <input
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />

                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />

                <label htmlFor="role">
                    <select
                        value={role}
                        onChange={this.onChange}
                        name="role"
                    >
                        {availableRoles.map(r => (
                            <option value={r} key={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </label>
            </form>
        );
    }
}

export default withFirebase(EditUser);
