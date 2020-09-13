import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../../components/Session';

import * as PERMISSIONS from './../../constants/permissions';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import useFirebase from 'hooks/useFirebase';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalActive, setModalActive] = useState(false);

  const firebase = useFirebase();

  useEffect(() => {
    firebase.roles().on('value', (result) => {
      const rolesObject = result.val();

      const roles = Object.keys(rolesObject).map((key) => ({
        ...rolesObject[key],
        name: key,
      }));

      setRoles(roles);
    });

    return () => {firebase.roles().off()};
  }, [firebase]);

  useEffect(() => {
    firebase.permissions().once('value').then((result) => {
      const permissionsObject = result.val();
      const permissions = Object.keys(permissionsObject);

      setPermissions(permissions);
    });
  }, [firebase]);

  return (<>
  <Modal
          active={modalActive}
          onClose={() => {
            setModalActive(false);
            setSelectedRole(null);
          }}
        >
          <RoleForm
            role={selectedRole}
            permissions={permissions}
            onSubmit={() => {
              setModalActive(false);
              setSelectedRole(null);
            }}
          />
        </Modal>

        <button
          className="btn"
          onClick={() => {
            setSelectedRole(null);
            setModalActive(true);
          }}
        >
          Ny rolle
        </button>

        {!roles.length || !permissions.length ? (
          <Spinner />
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
              {roles.map((role) => (
                <tr key={role.name}>
                  <td>{role.name}</td>
                  <td>{role.description}</td>
                  <td>
                    <button
                      className="btn btn-small"
                      onClick={() => {
                        setSelectedRole(role);
                        setModalActive(true);
                      }}
                    >
                      <i className="fas fa-edit" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  </>);
}

class RoleFormBase extends React.Component {
  constructor(props) {
    super(props);

    const role = {
      name: '',
      description: '',
      restricted: false,
      permissions: {},
      ...props.role,
    };

    this.state = {
      ...role,
    };
  }

  onChange = (e) => {
    let value = e.target.value;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked;
    }
    this.setState({
      [e.target.name]: value,
    });
  };

  onPermissionChange = (e) => {
    const { permissions } = this.state;

    if (e.target.checked) {
      permissions[e.target.name] = e.target.name;
    } else {
      if (permissions[e.target.name]) {
        delete permissions[e.target.name];
      }
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, description, permissions, restricted } = this.state;

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

    this.props.firebase.role(name).set({ description, permissions, restricted });

    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  render() {
    const { name, description, restricted, permissions } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        {this.props.role && <h1>{name}</h1>}
        {!this.props.role && (
          <React.Fragment>
            <label htmlFor="name">Navn</label>
            <input type="text" name="name" value={name} onChange={this.onChange} />
          </React.Fragment>
        )}

        <label htmlFor="description">Beskrivelse</label>
        <input type="text" name="description" value={description} onChange={this.onChange} />

        <label htmlFor="restricted">Begrenset</label>
        <input type="checkbox" name="restricted" checked={restricted} onChange={this.onChange} />
        <p className="light">
          Bare brukere med tilgangen "set-restricted-roles" kan tildele begrensede roller. Dette er nyttig for å la en
          moderator kunne dele ut alle andre roller enn sin egen eller høyere.
        </p>

        <h2>Tilganger</h2>
        {this.props.permissions.map((permission) => (
          <span key={permission}>
            <label>{permission}</label>
            <input
              type="checkbox"
              name={permission}
              key={permission}
              checked={permissions && permissions[permission]}
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

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.ROLES_WRITE];

const RoleForm = withFirebase(RoleFormBase);

export default compose(withAuthorization(authCondition))(RolesPage);
