import { useState, useEffect } from 'react';
import useFirebase from './useFirebase';

const useMembers = (activeOnly = true, sort = true) => {
  const [members, setMembers] = useState([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.members().on('value', (snapshot) => {
      const membersObject = snapshot.val();
      let members = Object.keys(membersObject).map((key) => ({
        ...membersObject[key],
        id: key,
      }));

      if (activeOnly) {
        members = members.filter((member) => member.active);
      }

      if (sort) {
        members = members.sort((a, b) => {
          const a1 = (a.first_name + a.last_name).toLowerCase();
          const b1 = (b.first_name + b.last_name).toLowerCase();
          if (a1 < b1) return -1;
          if (b1 < a1) return 1;
          return 0;
        });
      }

      setMembers(members);
    });

    return () => firebase.members().off();
  }, [firebase]);

  return [members, setMembers];
};

export { useMembers };
export default useMembers;
