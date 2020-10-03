import React, { useState } from 'react';
import { compose } from 'recompose';
import moment from 'moment';
import jStat from 'jStat';

import { withFirebase } from '../components/Firebase';
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

class OldSemesterStatistics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      semesters: [],
      events: [],
      selectedSemester: null,
    };
  }

  componentDidMount() {
    this.props.firebase.semesters().on('value', (snapshot) => {
      const semestersObject = snapshot.val();
      const semesters = Object.keys(semestersObject)
        .map((key) => ({
          ...semestersObject[key],
          uid: key,
        }))
        .sort((a, b) => moment(b.end_date) - moment(a.end_date));
      this.setState({ semesters });
    });

    this.props.firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      const events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        uid: key,
      }));
      this.setState({ events });
    });
  }

  componentWillUnmount() {
    this.props.firebase.semesters().off();
    this.props.firebase.events().off();
  }

  handleSelectSemester(selectedSemesterUid) {
    const s = this.state.semesters.filter((s) => s.uid === selectedSemesterUid)[0];
    this.setState({ selectedSemester: s });
  }

  render() {
    const { semesters, events, selectedSemester } = this.state;

    const filteredEvents = events.filter((event) => {
      const d = moment(event.date);
      return (
        (!selectedSemester || (d >= moment(selectedSemester.start_date) && d <= moment(selectedSemester.end_date))) &&
        event.type === 'Øvelse'
      );
    });

    const attendance = filteredEvents.map((e) => (e.attendants ? Object.keys(e.attendants).length : 0));

    const meanAttendance = round(jStat.mean(attendance), 2);
    const medianAttendance = jStat.median(attendance);
    let modeAttendance = jStat.mode(attendance);
    if (Array.isArray(modeAttendance)) {
      modeAttendance = modeAttendance.join(', ');
    }

    const maxAttendance = jStat.max(attendance);
    const minAttendance = jStat.min(attendance);

    return (
      <div className="content">
        <h1>Semesterstatistikk</h1>

        {(!semesters.length || !events.length) && <Spinner />}
        {!!semesters.length && !!events.length && (
          <React.Fragment>
            <select
              onChange={(event) => {
                return this.handleSelectSemester(event.target.value);
              }}
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
          </React.Fragment>
        )}
      </div>
    );
  }
}

const authCondition = (authUser) =>
  !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_READ] && !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

export default compose(withFirebase, withAuthorization(authCondition))(SemesterStatistics);
