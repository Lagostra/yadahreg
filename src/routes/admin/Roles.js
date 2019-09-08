import React from 'react';
import { withFirebase } from '../../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../../components/Session';

import * as PERMISSIONS from './../../constants/permissions';

class RolesListBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roles: [], permissions: [], selectedRole: '' };
    }

    componentDidMount() {
        this.props.firebase
            .roles()
            .once('value')
            .then(result => {
                const rolesObject = result.val();

                const roles = Object.keys(rolesObject).map(key => ({
                    ...rolesObject[key],
                    name: key,
                }));

                this.setState({ roles });
            });

        this.props.firebase
            .permissions()
            .once('value')
            .then(result => {
                const permissionsObject = result.val();
                const permissions = Object.keys(permissionsObject);

                this.setState({ permissions });
            });
    }

    selectRole = role => {
        if (this.state.selectedRole === role) {
            this.setState({ selectedRole: '' });
        } else {
            this.setState({ selectedRole: role });
        }
    };

    render() {
        const { roles, selectedRole, permissions } = this.state;

        return (
            <ul>
                {(!this.state.roles.length ||
                    !this.state.permissions.length) &&
                    'Loading...'}
                {roles.map(role => (
                    <li
                        key={role.name}
                        onClick={e =>
                            e.currentTarget === e.target
                                ? this.selectRole(role)
                                : null
                        }
                    >
                        {role.name}
                        {selectedRole === role && (
                            <RoleEditor
                                role={role}
                                permissions={permissions}
                            ></RoleEditor>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
}

const RolesList = withFirebase(RolesListBase);

class RoleEditorBase extends React.Component {
    constructor(props) {
        super(props);

        const role = props.role;
        if (!role.permissions) {
            role.permissions = {};
        }

        this.state = {
            permissions: props.permissions,
            role,
        };
    }

    onChange = e => {
        const { role } = this.state;

        if (e.target.checked) {
            role.permissions[e.target.name] = e.target.name;
        } else {
            if (role.permissions.hasOwnProperty(e.target.name)) {
                delete role.permissions[e.target.name];
            }
        }

        this.setState({ role });
    };

    onSubmit = e => {
        e.preventDefault();

        const role = { ...this.state.role };
        const name = role.name;
        delete role.name;

        this.props.firebase.role(name).set(role);
    };

    render() {
        const { role, permissions } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                {permissions.map(permission => (
                    <span key={permission}>
                        <label>{permission}</label>
                        <input
                            type="checkbox"
                            name={permission}
                            key={permission}
                            checked={
                                role.permissions &&
                                role.permissions.hasOwnProperty(
                                    permission,
                                )
                            }
                            onChange={this.onChange}
                        />
                    </span>
                ))}
                <button type="submit">Save</button>
            </form>
        );
    }
}

const RolesPage = () => (
    <div className="content">
        <h1>Roller</h1>
        <RolesList />
    </div>
);

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.ROLES_WRITE];

const RoleEditor = withFirebase(RoleEditorBase);

export default compose(withAuthorization(authCondition))(RolesPage);
