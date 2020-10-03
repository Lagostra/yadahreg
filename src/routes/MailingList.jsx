import React, { useState } from 'react';

import { withAuthorization } from '../components/Session';
import copyTextToClipboard from '../util/copyTextToClipboard';
import Spinner from '../components/Spinner';
import * as PERMISSIONS from '../constants/permissions';
import moment from 'moment';
import { useMembers } from 'hooks';

const MailingList = () => {
  const [members] = useMembers();
  const [useDates, setUseDates] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(6, 'd').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().add(1, 'd').format('YYYY-MM-DD'));

  const chosenMembers = useDates
    ? members
      .filter((member) => 'created_at' in member)  
      .filter(
        (member) =>
          moment(member['created_at']) > moment(startDate) && moment(member['created_at'] < moment(endDate)),
      )
    : members;
  const mails = chosenMembers?.map((member) => member.email);
  const mailString = mails?.join(';');

  return (
    <div className="content">
      {!members && <Spinner />}
      {!!members && (
        <>
          <label htmlFor="useDates">Bare send til nye medlemmer</label>
          <input type="checkbox" name="useDates" value={useDates} onClick={e => setUseDates(e.currentTarget.checked)} />
          {useDates && (
            <>
              <label htmlFor="startDate">Startdato:</label>
              <input type="date" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />

              <label htmlFor="endDate">Sluttdato:</label>
              <input type="date" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </>
          )}
          <a href={'mailto:' + mailString} className="btn">
            Send mail
          </a>
          <button className="btn" onClick={() => copyTextToClipboard(mailString)}>
            Kopier mailadresser
          </button>
        </>
      )}
    </div>
  );
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_READ];

export default withAuthorization(authCondition)(MailingList);
