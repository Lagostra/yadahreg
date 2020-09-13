import React, { useEffect, useState } from 'react';

import * as PERMISSIONS from '../../constants/permissions';
import useFirebase from 'hooks/useFirebase';
import useAuthUser from 'hooks/useAuthUser';

const UserForm = ({user: userProp}) => {
  const user_ = {
    name: '',
    email: '',
    role: '',
    ...userProp,
  };

  const [name, setName] = useState(user_.name);
  const [email, setEmail] = useState(user_.email);
  const [role, setRole] = useState(user_.role);
  const [availableRoles, setAvailableRoles] = useState([]);

  const firebase = useFirebase();
  const authUser = useAuthUser();

  useEffect(() => {
    const user_ = {
      name: '',
      email: '',
      role: '',
      ...userProp,
    };

    setName(user_.name);
    setEmail(user_.email);
    setRole(user_.role);
  }, [userProp]);

  useEffect(() => {
    firebase.roles().once('value').then((snapshot) => {
      const roleObject = snapshot.val();
      const roles = Object.keys(roleObject).map((key) => ({ ...roleObject[key], name: key }));
      setAvailableRoles(roles);
    })
  }, [firebase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {name, email, role};
    firebase.user(userProp.uid).set(user);
  }

  const restrictedRoles = availableRoles.filter((r) => r.restricted).map((r) => r.name);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Endre bruker</h1>
      <label htmlFor="name">Navn</label>
      <input name="name" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />

      <label htmlFor="email">E-post</label>
      <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email Address" />

      <label htmlFor="role">Rolle</label>
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        name="role"
        disabled={restrictedRoles.includes(role) && !authUser.permissions[PERMISSIONS.SET_RESTRICTED_ROLES]}
      >
        <option value="" title="Ingen rolle - brukeren vil ikke ha tilgang til noen funksjoner.">
          Ingen rolle
        </option>
        {availableRoles.map((r) => (
          <option
            value={r.name}
            key={r.name}
            title={r.description}
            disabled={r.restricted && !authUser.permissions[PERMISSIONS.SET_RESTRICTED_ROLES]}
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


export default UserForm;
