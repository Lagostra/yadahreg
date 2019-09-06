import React from 'react';
import { compose } from 'recompose';

import {
    withAuthorization,
    withAuthUser,
} from '../components/Session';

class UserInfo extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.authUser.name}</h1>
                <p>Email: {this.props.authUser.email}</p>
            </div>
        );
    }
}

const authCondition = authUser => !!authUser;

export default compose(
    withAuthorization(authCondition),
    withAuthUser,
)(UserInfo);
