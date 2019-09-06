import React from 'react';
import { withFirebase } from '../../components/Firebase';

class RolesList extends React.Component {
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
                {roles.map(role => (
                    <li
                        key={role.name}
                        onClick={() => this.selectRole(role)}
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

class RoleEditorBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            permissions: props.permissions,
            role: props.role,
        };
    }

    onChange = e => {
        const { role } = this.state;

        if (e.target.checked) {
        }
    };

    render() {
        const { role, permissions } = this.state;

        return (
            <div>
                <div>
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
                </div>
            </div>
        );
    }
}

const RoleEditor = withFirebase(RoleEditorBase);

export default withFirebase(RolesList);
