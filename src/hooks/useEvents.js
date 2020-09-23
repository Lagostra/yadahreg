import { useState, useEffect } from 'react';
import moment from 'moment';

import { useFirebase } from 'hooks';

const useEvents = (sort = true) => {
  const [events, setEvents] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      let events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        id: key,
      }));
      if (sort) {
        events = events.sort((a, b) => moment(b.date) - moment(a.date));
      }
      setEvents(events);
    });
    return () => firebase.events().off();
  }, [firebase, sort]);

  return [events, setEvents];
};

export { useEvents };
