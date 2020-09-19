import { useEffect, useState } from 'react';
import moment from 'moment';

import useFirebase from './useFirebase';

const useSemesters = () => {
  const [semesters, setSemesters] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.semesters().on('value', (snapshot) => {
      const semestersObject = snapshot.val();
      const semesters = Object.keys(semestersObject)
        .map((key) => ({
          ...semestersObject[key],
          id: key,
        }))
        .sort((a, b) => moment(b.end_date) - moment(a.end_date));

      setSemesters(semesters);
    });
    return () => firebase.semesters().off();
  }, [firebase]);

  return [semesters, setSemesters];
};

export { useSemesters };
