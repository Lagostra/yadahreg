import React, { Component, useEffect, useState } from 'react';

import * as PERMISSIONS from '../../constants/permissions';
import { withAuthorization } from '../../components/Session';
import Modal from '../../components/Modal';
import UserForm from './UserForm';
import Spinner from '../../components/Spinner';
import useFirebase from 'hooks/useFirebase';

const UsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const firebase = useFirebase();

  useEffect(() => {
    setLoading(true);

    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject)
        .map((key) => ({
          ...usersObject[key],
          uid: key,
        }))
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (b.name < a.name) return 1;
          return 0;
        });
        setUsers(usersList);
        setLoading(false);
    });

    return () => firebase.users().off();
  }, [firebase]);

  return (
    <div className="content">
      <h1>Brukere</h1>

      <Modal active={modalActive} onClose={() => setModalActive(false)}>
        <UserForm
          user={editUser}
          onSubmit={() => {
            setEditUser(null);
            setModalActive(false);
          }}
        />
      </Modal>

      {loading && <Spinner />}

      {!loading && <UsersList users={users} onEditUser={(user) => {setEditUser(user); setModalActive(true);}} />}
    </div>
  );
}

const UsersList = ({ users, onEditUser }) => (
  <table className="table-full-width table-hor-lines-between">
    <thead>
      <tr>
        <th>Navn</th>
        <th className="desktop-only">E-post</th>
        <th className="desktop-only">Rolle</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.uid}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <button className="btn btn-small" onClick={() => onEditUser(user)}>
              <i className="fas fa-edit" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.USERS_READ];

export default withAuthorization(authCondition)(UsersPage);
