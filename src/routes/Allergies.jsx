import React from 'react';

import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import { withAuthorization } from '../components/Session';
import { useMembers } from 'hooks';

const Allergies = () => {
  const [members] = useMembers();

  const membersWithAllergies = members?.filter(member => !!member.allergies);

  return (
    <div className="content">
      <h1>Allergier</h1>
      {!members && <Spinner />}
      {!!members && members.length && (
        <table className="table-full-width table-hor-lines-between">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Allergi(er)</th>
            </tr>
          </thead>
          <tbody>
            {membersWithAllergies.map((member) => (
              <tr key={member.id}>
                <td>
                  {member.first_name} {member.last_name}
                </td>
                <td>{member.allergies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_READ];

export default withAuthorization(authCondition)(Allergies);
