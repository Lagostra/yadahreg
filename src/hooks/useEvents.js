const { useState, useEffect } = require('react');
const { default: useFirebase } = require('./useFirebase');

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.events().on('value', (snapshot) => {
      const eventsObject = snapshot.val();
      const events = Object.keys(eventsObject).map((key) => ({
        ...eventsObject[key],
        id: key,
      }));
      setEvents(events);
    });
    return () => firebase.events().off();
  });

  return [events, setEvents];
};

export { useEvents };
