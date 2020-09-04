import React from 'react';
import { withFirebase } from '../../components/Firebase';
import RegistrationForm from './RegistrationForm';
import EventSelector from './EventSelector';
import { compose } from 'recompose';
import * as PERMISSIONS from '../../constants/permissions';
import { withAuthorization, withAuthUser } from '../../components/Session';
import moment from 'moment';

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      event: null,
      semester: null,
    };
  }

  componentDidMount() {
    const { authUser, firebase } = this.props;

    firebase.members().on('value', (snapshot) => {
      const membersObject = snapshot.val();
      const members = Object.keys(membersObject)
        .map((key) => ({
          ...membersObject[key],
          id: key,
        }))
        .filter((member) => member.active)
        .sort((a, b) => {
          const a1 = (a.first_name + a.last_name).toLowerCase();
          const b1 = (b.first_name + b.last_name).toLowerCase();
          if (a1 < b1) return -1;
          if (b1 < a1) return 1;
          return 0;
        });

      this.setState({ members });
    });

    if (!!authUser.permissions[PERMISSIONS.SEMESTERS_READ]) {
      firebase
        .semesters()
        .once('value')
        .then((snapshot) => {
          const semestersObject = snapshot.val();
          const semesters = Object.keys(semestersObject).map((key) => ({
            ...semestersObject[key],
            id: key,
          }));

          const lastSemester = semesters.reduce((a, b) => (moment(a.end_date) > moment(b.end_data) ? a : b));

          this.setState({ semester: lastSemester });
        });
    }
  }

  componentWillUnmount() {
    this.props.firebase.members().off();
    if (this.state.event) {
      this.props.firebase.event(this.state.event.id).off();
    }
  }

  handleRegistrationChange = (member, value) => {
    const { firebase } = this.props;
    const { event } = this.state;

    if (!event['attendants']) {
      event.attendants = {};
    }
    if (!event['non_attendants']) {
      event['non_attendants'] = {};
    }

    if (value === 'present') {
      event.attendants[member.id] = member.id;
      delete event.non_attendants[member.id];
    } else if (value === 'notified') {
      delete event.attendants[member.id];
      event.non_attendants[member.id] = member.id;
    } else if (value === 'not-present') {
      delete event.attendants[member.id];
      delete event.non_attendants[member.id];
    }

    const saveEvent = { ...event };
    delete saveEvent['id'];

    this.setState({ event });

    firebase.event(event.id).set(saveEvent);
  };

  handleChangeEvent = () => {
    this.props.firebase.event(this.state.event.id).off();
    this.setState({ event: null });
  };

  handleEventSelect = (event) => {
    if (this.state.event) {
      this.props.firebase.event(this.state.event.id).off();
    }
    this.props.firebase.event(event.id).on('value', (snapshot) => {
      this.setState({
        event: { ...snapshot.val(), id: event.id },
      });
    });
  };

  render() {
    const { event, members, semester } = this.state;
    return (
      <div className="content">
        {!event && <EventSelector onEventSelect={this.handleEventSelect} />}
        {event && (
          <RegistrationForm
            onRegistrationChange={this.handleRegistrationChange}
            members={members}
            event={event}
            semester={semester}
            onChangeEvent={this.handleChangeEvent}
          />
        )}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_WRITE];

export default compose(withFirebase, withAuthorization(authCondition), withAuthUser)(RegistrationPage);
