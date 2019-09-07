import React from 'react';

import { withFirebase } from './Firebase';

const SignOUtButton = ({ firebase, buttonClass }) => (
    <button
        type="button"
        onClick={firebase.doSignOut}
        className={buttonClass}
    >
        Sign Out
    </button>
);

export default withFirebase(SignOUtButton);
