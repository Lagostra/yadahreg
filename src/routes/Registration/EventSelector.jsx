import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Modal from '../../components/Modal';
import EventForm from './EventForm';
import useFirebase from 'hooks/useFirebase';
import Spinner from '../../components/Spinner';

const EventSelector = ({ onEventSelect }) => {
  const firebase = useFirebase();

  const [modalActive, setModalActive] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      let events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        id: key,
      }));

      events.sort((a, b) => moment(b.date) - moment(a.date));

      setEvents(events);
    })

    return () => firebase.events().off();
  }, [firebase]);

  const createNewRehearsal = () => {
    const event = {
      title: 'Korøvelse',
      type: 'Øvelse',
      date: new Date().toISOString().split('T')[0],
    };

    if (events.find((e) => e.date === event.date && e.type === event.type).length) {
      if (!window.confirm('Det finnes allerede en øvelse i dag. Vil du likevel opprette en ny?')) {
        return;
      }
    }

    const newRef = firebase.events().push(event);
    event.id = newRef.getKey();

    onEventSelect(event);
  };

  const handleEventEdit = (event) => {
    setEditEvent(event);
    setModalActive(true);
  };

  return (
    <div className="event-selector">
      <Modal active={modalActive} onClose={() => setModalActive(false)}>
        <EventForm
          event={editEvent}
          onSubmit={(event) => {
            if (!!event) {
              onEventSelect(event);
            }
            setModalActive(false);
            setEditEvent(null);
          }}
        />
      </Modal>
      <div className="event-selector__button-bar">
        <button className="btn" onClick={createNewRehearsal}>
          Ny øvelse i dag
        </button>
        <button
          className="btn"
          onClick={() =>{
            setModalActive(true);
            setEditEvent(null);
          }}
        >
          Nytt arrangement
        </button>
      </div>
      {!events.length && <Spinner />}
      {!!events.length && (
        <EventList events={events} onEventSelect={onEventSelect} onEventEdit={handleEventEdit} />
      )}
    </div>
  );
}

const EventList = ({ events, onEventSelect, onEventEdit }) => {
  return (
    <table className="table-full-width table-hor-lines-between table-last-td-right">
      <thead>
        <tr>
          <th>Dato</th>
          <th>Tittel</th>
          <th className="desktop-only">Type</th>
          <th className="desktop-only">Antall oppmøtte</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <EventListElement event={event} key={event.id} onEventSelect={onEventSelect} onEventEdit={onEventEdit} />
        ))}
      </tbody>
    </table>
  );
};

const EventListElement = ({ event, onEventSelect, onEventEdit }) => {
  return (
    <tr>
      <td>{moment(event.date).format('DD.MM.YYYY')}</td>
      <td>{event.title}</td>
      <td className="desktop-only">{event.type}</td>
      <td className="desktop-only">{!!event.attendants ? Object.keys(event.attendants).length : '0'}</td>
      <td>
        {/* <button
                    onClick={() => onEventEdit(event)}
                    className="btn btn-secondary btn-small"
                >
                    <i className="fas fa-edit" />
                </button> */}
        <button onClick={() => onEventSelect(event)} className="btn btn-small">
          Velg
        </button>
      </td>
    </tr>
  );
};

export default EventSelector;
