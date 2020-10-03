import React, { useState } from 'react';
import moment from 'moment';
import jStat from 'jStat';

import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import round from '../util/round';
import { useEvents, useSemesters } from 'hooks';

const SemesterStatistics = () => {
  const [semesters] = useSemesters();
  const [events] = useEvents();
  const [selectedSemester, setSelectedSemester] = useState(null);

  const filteredEvents = events?.filter((event) => {
    const d = moment(event.date);
    return (
      (!selectedSemester || (d >= moment(selectedSemester.start_date) && d <= moment(selectedSemester.end_date))) &&
      event.type === 'Øvelse'
    );
  });

  const attendance = filteredEvents?.map((e) => (e.attendants ? Object.keys(e.attendants).length : 0));

  const meanAttendance = attendance ? round(jStat.mean(attendance), 2) : null;
  const medianAttendance = attendance ? jStat.median(attendance) : null;
  let modeAttendance = attendance ? jStat.mode(attendance) : null;
  if (Array.isArray(modeAttendance)) {
    modeAttendance = modeAttendance.join(', ');
  }

  const maxAttendance = attendance ? jStat.max(attendance) : null;
  const minAttendance = attendance ? jStat.min(attendance) : null;

  return (
    <div className="content">
      <h1>Semesterstatistikk</h1>

      {(!semesters || !events) && <Spinner />}
      {!!semesters && !!events && (
        <>
          <select
            onChange={(e) => setSelectedSemester(semesters?.find(s => s.uid === e.target.value))}
            value={selectedSemester ? selectedSemester.uid : ''}
          >
            <option value={''}>Totalt</option>
            {semesters.map((semester) => (
              <option value={semester.uid} key={semester.uid}>
                {semester.title}
              </option>
            ))}
          </select>

          <table className="table-full-width table-hor-lines-between">
            <tbody>
              <tr>
                <td>Antall øvelser</td>
                <td>{filteredEvents.length}</td>
              </tr>
              <tr>
                <td>Gjennomsnittlig oppmøte</td>
                <td>{meanAttendance}</td>
              </tr>
              <tr>
                <td>Maksimalt oppmøte</td>
                <td>{maxAttendance}</td>
              </tr>
              <tr>
                <td>Minimalt oppmøte</td>
                <td>{minAttendance}</td>
              </tr>
              <tr>
                <td>Median</td>
                <td>{medianAttendance}</td>
              </tr>
              <tr>
                <td>Typetall</td>
                <td>{modeAttendance}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const authCondition = (authUser) =>
  !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_READ] && !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

export default withAuthorization(authCondition)(SemesterStatistics);
