import { useContext } from 'react';
import { AuthUserContext } from 'components/Session';

const useAuthUser = () => useContext(AuthUserContext);

export { useAuthUser };
export default useAuthUser;
