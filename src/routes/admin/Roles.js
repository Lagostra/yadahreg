import React from 'react';
import { withFirebase } from '../../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../../components/Session';

import * as PERMISSIONS from './../../constants/permissions';
import Modal from '../../components/Modal';

class RolesListBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            permissions: [],
            selectedRole: null,
            modalActive: false,
        };
    }

    componentDidMount() {
        this.props.firebase.roles().on('value', result => {
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

    componentWillUnmount() {
        this.props.firebase.roles().off();
    }

    render() {
        const {
            roles,
            selectedRole,
            permissions,
            modalActive,
        } = this.state;

        return (
            <React.Fragment>
                <Modal
                    active={modalActive}
                    onClose={() =>
                        this.setState({
                            modalActive: false,
                            selectedRole: null,
                        })
                    }
                >
                    <RoleForm
                        role={selectedRole}
                        permissions={permissions}
                        onSubmit={() =>
                            this.setState({
                                selectedRole: null,
                                modalActive: false,
                            })
                        }
                    />
                </Modal>

                <button
                    className="btn"
                    onClick={() =>
                        this.setState({
                            selectedRole: null,
                            modalActive: true,
                        })
                    }
                >
                    Ny rolle
                </button>

                {!this.state.roles.length ||
                !this.state.permissions.length ? (
                    <p>Laster...</p>
                ) : (
                    <table className="table-full-width table-hor-lines-between">
                        <thead>
                            <tr>
                                <th>Rolle</th>
                                <th>Beskrivelse</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(role => (
                                <tr
                                    key={role.name}
                                    onClick={e =>
                                        e.currentTarget === e.target
                                            ? this.selectRole(role)
                                            : null
                                    }
                                >
                                    <td>{role.name}</td>
                                    <td>{role.description}</td>
                                    <td>
                                        <button
                                            className="btn btn-small"
                                            onClick={() =>
                                                this.setState({
                                                    selectedRole: role,
                                                    modalActive: true,
                                                })
                                            }
                                        >
                                            <i className="fas fa-edit" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </React.Fragment>
        );
    }
}

const RolesList = withFirebase(RolesListBase);

class RoleFormBase extends React.Component {
    constructor(props) {
        super(props);

        const role = {
            name: '',
            description: '',
            permissions: {},
            ...props.role,
        };

        this.state = {
            ...role,
        };
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    onPermissionChange = e => {
        const { permissions } = this.state;

        if (e.target.checked) {
            permissions[e.target.name] = e.target.name;
        } else {
            if (permissions[e.target.name]) {
                delete permissions[e.target.name];
            }
        }
    };

    onSubmit = e => {
        e.preventDefault();
        const { name, description, permissions } = this.state;

        /*
        if (name !== this.props.name) {
            if (
                !window.confirm(
                    'Du er i ferd med å endre navn på en rolle. Det betyr at brukere som har denne rollen, kan miste rettigheter. Vil du fortsette?',
                )
            ) {
                return;
            }

            this.props.firebase.role(this.props.name).remove();
        }
        */

        this.props.firebase
            .role(name)
            .set({ description, permissions });

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    };

    render() {
        const { name, description, permissions } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                {this.props.role && <h1>{name}</h1>}
                {!this.props.role && (
                    <React.Fragment>
                        <label htmlFor="name">Navn</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={this.onChange}
                        />
                    </React.Fragment>
                )}

                <label htmlFor="description">Beskrivelse</label>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={this.onChange}
                />

                {this.props.permissions.map(permission => (
                    <span key={permission}>
                        <label>{permission}</label>
                        <input
                            type="checkbox"
                            name={permission}
                            key={permission}
                            checked={
                                permissions && permissions[permission]
                            }
                            onChange={this.onPermissionChange}
                        />
                    </span>
                ))}
                <button type="submit" className="btn">
                    Lagre
                </button>
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

const RoleForm = withFirebase(RoleFormBase);

export default compose(withAuthorization(authCondition))(RolesPage);
