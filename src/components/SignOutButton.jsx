import React from 'react';

import useFirebase from 'hooks/useFirebase';

const SignOUtButton = ({ buttonClass }) => {
  const firebase = useFirebase();

  return (<button type="button" onClick={firebase.doSignOut} className={buttonClass}>
    Logg ut
  </button>);
}

export default SignOUtButton;
