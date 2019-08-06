import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import Navigation from './components/Navigation';
import LandingPage from './views/LandingPage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';

const App = () => (
    <Router>
        <Navigation />

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
    </Router>
);

export default App;
