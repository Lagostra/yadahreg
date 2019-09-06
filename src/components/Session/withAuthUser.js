import React from 'react';
import { AuthUserContext } from '.';

const withAuthUser = Component => props => (
    <AuthUserContext.Consumer>
        {authUser => <Component {...props} authUser={authUser} />}
    </AuthUserContext.Consumer>
);

export default withAuthUser;
