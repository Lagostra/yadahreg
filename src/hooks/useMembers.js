import { useState, useEffect } from 'react';
import useFirebase from './useFirebase';

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.members().on('value', (snapshot) => {
      const membersObject = snapshot.val();
      const members = Object.keys(membersObject).map((key) => ({
        ...membersObject[key],
        id: key,
      }));
      setMembers(members);
    });
    return () => firebase.members().off();
  }, [firebase]);

  return [members, setMembers];
};

export { useMembers };
export default useMembers;
