import React from 'react';
import XLSX from 'xlsx';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';
import { useAuthUser, useEvents, useFirebase, useMembers, useSemesters } from 'hooks';

const DataExportBase = () => {
  const authUser = useAuthUser();
  const firebase = useFirebase();

  const [members] = useMembers();
  const [events] = useEvents();
  const [semesters] = useSemesters();

  
  const exportAllAsExcel = () => {
    if (!members || !events || !semesters) return;

    const membersSheet = XLSX.utils.json_to_sheet(members, {
      header: [
        'uid',
        'last_name',
        'first_name',
        'phone',
        'email',
        'address',
        'birthday',
        'gender',
        'active',
        'allergies',
        'voice_group',
      ],
    });

    const presence = members.map((member) => {
      const row = {
        last_name: member.last_name,
        first_name: member.first_name,
        uid: member.uid,
      };

      events.forEach((event) => {
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
      header: ['uid', 'last_name', 'first_name'].concat(
        events.map((event) => `${moment(event.date).format('DD.MM.YYYY')} - ${event.title}`),
      ),
    });

    const saveEvents = events.map((event) => {
      let e = { ...event };
      delete e['attendants'];
      delete e['non_attendants'];

      return e;
    });

    const eventsSheet = XLSX.utils.json_to_sheet(saveEvents, {
      header: ['uid', 'date', 'title', 'type'],
    });

    const payment = members.map((member) => {
      const row = {
        last_name: member.last_name,
        first_name: member.first_name,
        uid: member.uid,
      };

      semesters.forEach((semester) => {
        row[semester.title] = semester.payees && semester.payees[member.uid] ? 1 : '';
      });

      return row;
    });

    const paymentSheet = XLSX.utils.json_to_sheet(payment, {
      header: ['uid', 'last_name', 'first_name'].concat(semesters.map((semester) => semester.title)),
    });

    const saveSemesters = semesters.map((semester) => {
      let s = { ...semester };
      delete s['payees'];

      return s;
    });
    const semestersSheet = XLSX.utils.json_to_sheet(saveSemesters, {
      header: ['uid', 'title', 'start_date', 'end_date'],
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, membersSheet, 'Medlemmer');
    XLSX.utils.book_append_sheet(wb, presenceSheet, 'Oppmøte');
    XLSX.utils.book_append_sheet(wb, paymentSheet, 'Betaling');
    XLSX.utils.book_append_sheet(wb, eventsSheet, 'Arrangementer');
    XLSX.utils.book_append_sheet(wb, semestersSheet, 'Semestere');
    XLSX.writeFile(wb, 'yadahreg-data.xlsx', {
      bookType: 'xlsx',
    });
  };

  const exportDatabaseAsJson = () => {
    firebase.db
      .ref('/')
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();

        const blob = new Blob([JSON.stringify(data, null, 4)], {
          type: 'application/json',
        });

        saveAs(blob, 'yadahreg-database.json');
      });
  };

  return (
    <div className="content">
      <button className="btn" onClick={exportAllAsExcel}>
        Eksporter alt som Excel
      </button>

      {authUser.permissions[PERMISSIONS.ROOT_READ] && (
        <button className="btn" onClick={exportDatabaseAsJson}>
          Eksporter database som JSON
        </button>
      )}
    </div>
  );
};

const authCondition = (authUser) =>
  !!authUser &&
  !!authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
  !!authUser.permissions[PERMISSIONS.EVENTS_READ] &&
  !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

const DataExport = withAuthorization(authCondition)(DataExportBase);

export default DataExport;
