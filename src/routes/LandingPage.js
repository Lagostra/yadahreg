import React from 'react';
import { withAuthorization } from '../components/Session';

const LandingPage = () => (
    <div>
        <h1>Landing page</h1>
    </div>
);

export default withAuthorization(authUser => !!authUser)(LandingPage);
