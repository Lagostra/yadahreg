import React, { useState } from 'react';
import SemesterSelector from './SemesterSelector';
import PaymentForm from './PaymentForm';
import * as PERMISSIONS from '../../constants/permissions';
import { withAuthorization } from '../../components/Session';
import { useFirebase, useMembers } from 'hooks';

const PaymentPage = () => {
  const [members] = useMembers();
  const [semester, setSemester] = useState(null);

  const firebase = useFirebase();

  const handlePaymentChange = (member, value) => {
    if (!semester['payees']) {
      semester.payees = {};
    }

    if (value === 'paid') {
      semester.payees[member.id] = member.id;
    } else if (value === 'not-paid') {
      delete semester.payees[member.id];
    }

    const saveSemester = { ...semester };
    delete saveSemester['id'];

    firebase.semester(semester.id).set(saveSemester);
  };


  const handleSemesterSelect = (semester) => {
    if (semester) {
      firebase.semester(semester.id).off();
    }

    firebase.semester(semester.id).on('value', (snapshot) => {
      setSemester(
        { ...snapshot.val(), id: semester.id },
      );
    });
  };

  return (
    <div className="content">
      {!semester && <SemesterSelector onSemesterSelect={handleSemesterSelect} />}
      {semester && (
        <PaymentForm
          onPaymentChange={handlePaymentChange}
          members={members}
          semester={semester}
          onChangeSemester={() => setSemester(null)}
        />
      )}
    </div>
  );
};
const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.SEMESTERS_WRITE];

export default withAuthorization(authCondition)(PaymentPage);
