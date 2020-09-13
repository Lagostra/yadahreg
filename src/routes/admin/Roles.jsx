import React, { useEffect, useState } from 'react';

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

const RoleForm = ({role: roleProp, onSubmit: handleSubmitProp, permissions: availablePermissions}) => {
  const role = {
    name: '',
    description: '',
    restricted: false,
    permissions: {},
    ...roleProp,
  };

  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [restricted, setRestricted] = useState(role.restricted);
  const [permissions, setPermissions] = useState(role.permissions);

  const firebase = useFirebase();

  const handleSubmit = (e) => {
    e.preventDefault();

    firebase.role(name).set({description, permissions, restricted});

    if (handleSubmitProp) {
      handleSubmitProp();
    }
  };

  const handlePermissionChange = (e) => {
    const permissions_ = {...permissions};
    if (e.target.checked) {
      permissions_[e.target.name] = e.target.name;
    } else {
      if (permissions_[e.target.name]) {
        delete permissions_[e.target.name];
      }
    }

    setPermissions(permissions_);
  };

  return (
    <form onSubmit={handleSubmit}>
      {roleProp && <h1>{name}</h1>}
      {!roleProp && (
        <>
          <label htmlFor="name">Navn</label>
          <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
        </>
      )}

      <label htmlFor="description">Beskrivelse</label>
      <input type="text" name="description" value={description} onChange={e => setDescription(e.target.value)} />

      <label htmlFor="restricted">Begrenset</label>
      <input type="checkbox" name="restricted" checked={restricted} onChange={e => setRestricted(e.target.checked)} />
      <p className="light">
        Bare brukere med tilgangen "set-restricted-roles" kan tildele begrensede roller. Dette er nyttig for å la en
        moderator kunne dele ut alle andre roller enn sin egen eller høyere.
      </p>

      <h2>Tilganger</h2>
      {availablePermissions.map((permission) => (
        <span key={permission}>
          <label>{permission}</label>
          <input
            type="checkbox"
            name={permission}
            key={permission}
            checked={!!permissions && !!permissions[permission]}
            onChange={handlePermissionChange}
          />
        </span>
      ))}
      <button type="submit" className="btn">
        Lagre
      </button>
    </form>
  );
}

const RolesPage = () => (
  <div className="content">
    <h1>Roller</h1>
    <RolesList />
  </div>
);

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.ROLES_WRITE];

export default withAuthorization(authCondition)(RolesPage);
