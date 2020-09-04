import React, { Component } from 'react';
import { compose } from 'recompose';

import * as PERMISSIONS from '../../constants/permissions';
import { withFirebase } from '../../components/Firebase';
import { withAuthorization } from '../../components/Session';
import Modal from '../../components/Modal';
import UserForm from './UserForm';
import Spinner from '../../components/Spinner';

class UsersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', (snapshot) => {
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

      this.setState({
        users: usersList,
        loading: false,
        modalActive: false,
        editUser: null,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleModalClose = () => {
    this.setState({ modalActive: false });
  };

  handleEditUser = (user) => {
    this.setState({ editUser: user, modalActive: true });
  };

  render() {
    const { users, loading, modalActive, editUser } = this.state;

    return (
      <div className="content">
        <h1>Brukere</h1>

        <Modal active={modalActive} onClose={this.handleModalClose}>
          <UserForm
            user={editUser}
            onSubmit={() =>
              this.setState({
                editUser: null,
                modalActive: false,
              })
            }
          />
        </Modal>

        {loading && <Spinner />}

        {!loading && <UsersList users={users} onEditUser={this.handleEditUser} />}
      </div>
    );
  }
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

export default compose(withFirebase, withAuthorization(authCondition))(UsersPage);
