import React, { useEffect, useState } from 'react';
import RegistrationForm from './RegistrationForm';
import EventSelector from './EventSelector';
import * as PERMISSIONS from 'constants/permissions';
import { withAuthorization } from 'components/Session';
import moment from 'moment';
import useFirebase from 'hooks/useFirebase';
import useAuthUser from 'hooks/useAuthUser';

const RegistrationPage = () => {
  const [members, setMembers] = useState([]);
  const [event, setEvent] = useState(null);
  const [semester, setSemester] = useState(null);

  const firebase = useFirebase();
  const authUser = useAuthUser();

  useEffect(() => {
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

      setMembers(members);
    });

    return () => firebase.members().off();
  }, [firebase]);

  useEffect(() => {
    if (event) {
      firebase.event(event.id).on('value', snapshot => {
        setEvent({...snapshot.val(), id: event.id})
      });

      return () => firebase.event(event.id).off();
    }
  }, [event, firebase]);

  useEffect(() => {
    if (!!authUser.permissions[PERMISSIONS.SEMESTERS_READ]) {
      firebase.semesters().once('value').then(snapshot => {
        const semestersObject = snapshot.val();
        const semesters = Object.keys(semestersObject).map((key) => ({
          ...semestersObject[key],
          id: key,
        }));

        const lastSemester = semesters.reduce((a, b) => (moment(a.end_date) > moment(b.end_data) ? a : b));
        setSemester(lastSemester);
      });
    }
  }, [firebase, authUser]);

  const handleRegistrationChange = (member, value) => {
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

    setEvent(event);

    firebase.event(event.id).set(saveEvent);
  };

  return (
    <div className="content">
      {!event && <EventSelector onEventSelect={(event) => setEvent(event)} />}
      {event && (
        <RegistrationForm
          onRegistrationChange={handleRegistrationChange}
          members={members}
          event={event}
          semester={semester}
          onChangeEvent={() => setEvent(null)}
        />
      )}
    </div>
  );
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.EVENTS_WRITE];

export default withAuthorization(authCondition)(RegistrationPage);
