import React from 'react';
import moment from 'moment';
import { compose } from 'recompose';
import XLSX from 'xlsx';

import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';
import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';

class AttendanceOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      events: [],
      startDate: moment().subtract(30, 'd').toDate(),
      endDate: moment().add(1, 'd').toDate(),
      filter: '',
    };
  }

  componentDidMount() {
    this.props.firebase.members().on('value', (snapshot) => {
      const membersObject = snapshot.val();
      const members = Object.keys(membersObject).map((key) => ({
        ...membersObject[key],
        uid: key,
      }));

      members.sort((a, b) => (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name));

      this.setState({ members });
    });

    this.props.firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      const events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        uid: key,
      }));

      events.sort((a, b) => moment(a.date) - moment(b.date));

      this.setState({ events });
    });
  }

  componentWillUnmount() {
    this.props.firebase.members().off();
    this.props.firebase.events().off();
  }

  isMatch = (filter, name) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(name);
  };

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value });
  };

  handleDateChange = (e) => {
    this.setState({
      [e.currentTarget.name]: moment(e.currentTarget.value).toDate(),
    });
  };

  handleDownload = (e) => {
    const { members, events, startDate, endDate, filter } = this.state;

    const filteredEvents = events.filter(
      (event) => moment(event.date) > moment(startDate) && moment(event.date) < moment(endDate),
    );

    const filteredMembers = members.filter(
      (member) => member.active && (!filter || this.isMatch(filter, member.first_name + ' ' + member.last_name)),
    );

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

  render() {
    const { members, events, startDate, endDate, filter } = this.state;

    const filteredEvents = events.filter(
      (event) => moment(event.date) > moment(startDate) && moment(event.date) < moment(endDate),
    );

    const filteredMembers = members.filter(
      (member) => member.active && (!filter || this.isMatch(filter, member.first_name + ' ' + member.last_name)),
    );

    return (
      <div className="content">
        {(!members.length || !events.length) && <Spinner />}
        {!!members.length && !!events.length && (
          <React.Fragment>
            <button className="btn" onClick={this.handleDownload}>
              Last ned som Excel
            </button>
            <div className="row">
              <div className="col-half">
                <label htmlFor="startDate">Startdato</label>
                <input
                  name="startDate"
                  value={moment(startDate).format('YYYY-MM-DD')}
                  onChange={this.handleDateChange}
                  type="date"
                />
              </div>

              <div className="col-half">
                <label htmlFor="endDate">Sluttdato</label>
                <input
                  name="endDate"
                  value={moment(endDate).format('YYYY-MM-DD')}
                  onChange={this.handleDateChange}
                  type="date"
                />
              </div>
            </div>
            <input value={filter} onChange={this.handleFilterChange} name="filter" type="text" placeholder="Søk..." />
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
                          {event.attendants && !!event.attendants[member.uid]
                            ? 'Y'
                            : event.non_attendants && !!event.non_attendants[member.uid]
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
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_WRITE];

export default compose(withFirebase, withAuthorization(authCondition))(AttendanceOverview);
