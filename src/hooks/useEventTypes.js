const { useState, useEffect } = require('react');
const { default: useFirebase } = require('./useFirebase');

const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .eventTypes()
      .once('value')
      .then((snapshot) => {
        const eventTypes = Object.keys(snapshot.val());
        setEventTypes(eventTypes);
      });
  });

  return [eventTypes, setEventTypes];
};

export { useEventTypes };
