import React, { useEffect, useState } from 'react';
import useFirebase from 'hooks/useFirebase';

const EventForm = ({event: eventProp, onSubmit}) => {
  const firebase = useFirebase();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('');

  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    if (eventProp) {
      setTitle(eventProp.title);
      setDate(eventProp.date);
      setType(eventProp.type);
    }
  }, [eventProp]);

  useEffect(() => {
    firebase.eventTypes().once('value').then((snapshot) => {
      const eventTypeObject = snapshot.val();
      const eventTypes_ = Object.keys(eventTypeObject);
      setEventTypes(eventTypes_);
    })
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    const event = {title, date, type};
    if (eventProp) {
      firebase.event(eventProp.id).set(event);
      event.id = eventProp.id;
    } else {
      const ref = firebase.events().push(event);
      event.id = ref.getKey();
    }

    if (onSubmit) {
      onSubmit(event);
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    if (!window.confirm('Er du sikker på at du vil slette arrangementet?')) {
      return;
    }

    if (eventProp) {
      firebase.event(eventProp.id).remove();
    }

    if (onSubmit) {
      onSubmit(null);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h1>{eventProp ? 'Rediger arrangement' : 'Nytt arrangement'}</h1>
      <label htmlFor="title">Tittel</label>
      <input name="title" value={title} onChange={e => setTitle(e.currentTarget.value)} type="text" />

      <label htmlFor="type">Type</label>
      <select value={type} onChange={e => setType(e.currentTarget.value)} name="type">
        <option value="" disabled>
          Velg type
        </option>
        {eventTypes.map((eventType) => (
          <option value={eventType} key={eventType}>
            {eventType}
          </option>
        ))}
      </select>

      <label htmlFor="date">Dato</label>
      <input name="date" value={date} onChange={e => setDate(e.currentTarget.value)} type="date" />

      <button type="submit" className="btn">
        Lagre
      </button>

      {eventProp && (
        <button className="btn btn-danger" style={{ float: 'right' }} onClick={handleDelete}>
          Slett <i className="fas fa-trash-alt" />
        </button>
      )}
    </form>
  );
}

export default EventForm;
