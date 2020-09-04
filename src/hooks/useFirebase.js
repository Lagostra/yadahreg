import { useContext } from 'react';
import { FirebaseContext } from 'components/Firebase';

const useFirebase = () => {
  return useContext(FirebaseContext);
}

export default useFirebase;