import React from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';

class TopListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      events: [],
      eventTypes: [],
      semesters: [],
      selectedSemester: '',
      eventTypeDrawerOpen: false,
      selectedEventTypes: ['Øvelse'],
      filter: '',
    };
  }

  componentDidMount() {
    this.props.firebase.members().on('value', (snapshot) => {
      const membersObject = snapshot.val();
      const members = Object.keys(membersObject).map((key) => ({
        ...membersObject[key],
        id: key,
      }));
      this.setState({ members });
    });

    this.props.firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      const events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        id: key,
      }));
      this.setState({ events });
    });

    this.props.firebase.semesters().on('value', (snapshot) => {
      const semestersObject = snapshot.val();
      const semesters = Object.keys(semestersObject)
        .map((key) => ({
          ...semestersObject[key],
          id: key,
        }))
        .sort((a, b) => moment(b.end_date) - moment(a.end_date));

      this.setState({
        selectedSemester: semesters[0],
        semesters,
      });
    });

    this.props.firebase
      .eventTypes()
      .once('value')
      .then((snapshot) => {
        const eventTypes = Object.keys(snapshot.val());
        this.setState({ eventTypes });
      });
  }

  componentWillUnmount() {
    this.props.firebase.events().off();
    this.props.firebase.semesters().off();
    this.props.firebase.members().off();
  }

  handleSelectSemester = (selectedSemesterId) => {
    const s = this.state.semesters.filter((s) => s.id === selectedSemesterId)[0];
    this.setState({ selectedSemester: s });
  };

  handleEventTypeChange = (event) => {
    let { selectedEventTypes } = this.state;
    const eventType = event.currentTarget.name;
    if (event.currentTarget.checked && !selectedEventTypes.includes(eventType)) {
      selectedEventTypes.push(eventType);
    } else if (!event.currentTarget.checked && selectedEventTypes.includes(eventType)) {
      selectedEventTypes = selectedEventTypes.filter((t) => t !== eventType);
    }

    this.setState({ selectedEventTypes });
  };

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value });
  };

  render() {
    const {
      members,
      events,
      semesters,
      selectedSemester,
      eventTypeDrawerOpen,
      eventTypes,
      selectedEventTypes,
      filter,
    } = this.state;

    const startDate =
      semesters && semesters.length ? (selectedSemester ? selectedSemester.start_date : '1970-01-01') : null;
    const endDate =
      semesters && semesters.length ? (selectedSemester ? selectedSemester.end_date : '4000-01-01') : null;
    return (
      <div className="content">
        <h1>Toppliste</h1>
        <select
          onChange={(event) => {
            return this.handleSelectSemester(event.target.value);
          }}
          value={selectedSemester ? selectedSemester.id : ''}
        >
          <option value={''}>Totalt</option>
          {semesters.map((semester) => (
            <option value={semester.id} key={semester.id}>
              {semester.title}
            </option>
          ))}
        </select>
        <div
          onClick={() => {
            this.setState({
              eventTypeDrawerOpen: !eventTypeDrawerOpen,
            });
          }}
          style={{ cursor: 'pointer', padding: '15px' }}
        >
          Typer arrangementer{' '}
          {eventTypeDrawerOpen ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />}
        </div>
        {eventTypeDrawerOpen && (
          <div style={{ padding: '0 15px' }}>
            {eventTypes.map((eventType) => (
              <React.Fragment key={eventType}>
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes(eventType)}
                  name={eventType}
                  onChange={this.handleEventTypeChange}
                  className="inline"
                />
                {eventType}
              </React.Fragment>
            ))}
          </div>
        )}
        <input value={filter} onChange={this.handleFilterChange} name="filter" type="text" placeholder="Søk..." />
        <TopList
          members={members}
          events={events}
          eventTypes={selectedEventTypes}
          startDate={startDate}
          endDate={endDate}
          filter={filter}
        />
      </div>
    );
  }
}

const TopList = ({ members, events, startDate, endDate, eventTypes = ['Øvelse'], filter }) => {
  if (!members || !events || !startDate || !endDate) {
    return <Spinner />;
  }

  events = events.filter((event) => {
    const d = moment(event.date);
    return d >= moment(startDate) && d <= moment(endDate) && (!eventTypes || eventTypes.includes(event.type));
  });

  members = members.map((member) => {
    const possibleEvents = events.filter(
      (e) => !member.created_at || moment(e.date).isSameOrAfter(member.created_at, 'day'),
    ).length;
    const count = events.reduce((prev, cur) => {
      if (cur.attendants && cur.attendants[member.id]) {
        return prev + 1;
      }
      return prev;
    }, 0);

    return {
      ...member,
      eventCount: count,
      eventFraction: possibleEvents ? count / possibleEvents : 0,
    };
  });

  members = members.filter((m) => m.eventCount > 0).sort((a, b) => b.eventCount - a.eventCount);
  let placement = 0;
  let lastCount = 100000000;
  members = members.map((member) => {
    if (member.eventCount < lastCount) {
      placement += 1;
      lastCount = member.eventCount;
    }

    return { ...member, placement: placement };
  });

  members = members.filter((m) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(m.first_name + ' ' + m.last_name);
  });

  return (
    <table className="table-full-width table-hor-lines-between">
      <thead>
        <tr>
          <th>Plass</th>
          <th>Navn</th>
          <th>Antall</th>
          <th title="Estimert andel av arrangementer som medlemmet har vært med i valgt periode som var etter at vedkommende ble med i koret.">
            Andel
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.placement}</td>
            <td>
              {member.first_name} {member.last_name}
            </td>
            <td>{member.eventCount}</td>
            <td title="Estimert andel av arrangementer som medlemmet har vært med i valgt periode som var etter at vedkommende ble med i koret.">
              {(member.eventFraction * 100).toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const authCondition = (authUser) =>
  !!authUser &&
  !!authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
  !!authUser.permissions[PERMISSIONS.EVENTS_READ] &&
  !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

export default compose(withFirebase, withAuthorization(authCondition))(TopListPage);
