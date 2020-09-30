import React, { useState } from 'react';
import moment from 'moment';
import XLSX from 'xlsx';

import Spinner from '../components/Spinner';
import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';
import { useEvents, useMembers } from 'hooks';

const AttendanceOverview = () => {
  const [members] = useMembers();
  const [events] = useEvents();
  const [startDate, setStartDate] = useState(moment().subtract(30, 'd').toDate());
  const [endDate, setEndDate] = useState(moment().add(1, 'd').toDate());
  const [filter, setFilter] = useState('');

  const isMatch = (filter, name) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(name);
  };

  const filteredEvents = events?.filter(
    (event) => moment(event.date) > moment(startDate) && moment(event.date) < moment(endDate),
  );

  const filteredMembers = members?.filter(
    (member) => member.active && (!filter || isMatch(filter, member.first_name + ' ' + member.last_name)),
  );

  const handleDownload = (e) => {
    const presence = filteredMembers.map((member) => {
      const row = {
        Etternavn: member.last_name,
        Fornavn: member.first_name,
        uid: member.uid,
      };

      filteredEvents.forEach((event) => {
        let status = '';
        if (event.attendants && event.attendants[member.uid]) {
          status = 1;
        } else if (event.non_attendants && event.non_attendants[member.uid]) {
          status = 0;
        }
        row[`${moment(event.date).format('DD.MM.YYYY')} - ${event.title}`] = status;
      });

      return row;
    });

    const presenceSheet = XLSX.utils.json_to_sheet(presence, {
      header: ['uid', 'Fornavn', 'Etternavn'].concat(
        filteredEvents.map((event) => `${moment(event.date).format('DD.MM.YYYY')} - ${event.title}`),
      ),
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, presenceSheet, 'Oppmøte');
    XLSX.writeFile(wb, 'yadahreg-oppmøte.xslx', {
      bookType: 'xlsx',
    });
  };

  return (
    <div className="content">
      {(!members || !events) && <Spinner />}
      {!!members && !!events && (
        <React.Fragment>
          <button className="btn" onClick={handleDownload}>
            Last ned som Excel
          </button>
          <div className="row">
            <div className="col-half">
              <label htmlFor="startDate">Startdato</label>
              <input
                name="startDate"
                value={moment(startDate).format('YYYY-MM-DD')}
                onChange={e => setStartDate(moment(e.currentTarget.value).toDate())}
                type="date"
              />
            </div>

            <div className="col-half">
              <label htmlFor="endDate">Sluttdato</label>
              <input
                name="endDate"
                value={moment(endDate).format('YYYY-MM-DD')}
                onChange={e => setEndDate(moment(e.currentTarget.value).toDate())}
                type="date"
              />
            </div>
          </div>
          <input value={filter} onChange={e => setFilter(e.target.value)} name="filter" type="text" placeholder="Søk..." />
          <div className="table-scroll-container">
            <table className="table-full-width table-hor-lines-between">
              <thead>
                <tr>
                  <th>Navn</th>
                  {filteredEvents.map((event) => (
                    <th key={event.uid}>{moment(event.date).format('DD.MM.YYYY')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i>Antall oppmøtte</i>
                  </td>
                  {filteredEvents.map((event) => (
                    <td key={event.uid}>{event.attendants ? Object.keys(event.attendants).length : 0}</td>
                  ))}
                </tr>
                {filteredMembers.map((member) => (
                  <tr key={member.uid}>
                    <td>
                      {member.first_name} {member.last_name}
                    </td>
                    {filteredEvents.map((event) => (
                      <td key={event.uid}>
                        {event.attendants && member.id in event.attendants
                          ? 'Y'
                          : event.non_attendants && member.id in event.non_attendants
                          ? 'N'
                          : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_WRITE];

export default withAuthorization(authCondition)(AttendanceOverview);
