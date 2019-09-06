import React from 'react';
import { compose } from 'recompose';

import {
    withAuthorization,
    AuthUserContext,
} from '../components/Session';

class UserInfo extends React.Component {
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <h1>User email: {authUser.email}</h1>
                        {console.debug(authUser)}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const authCondition = authUser => !!authUser;

export default compose(withAuthorization(authCondition))(UserInfo);
