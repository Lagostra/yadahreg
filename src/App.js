import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import Navigation from './components/Navigation';
import LandingPage from './views/LandingPage';
import SignIn from './views/SignIn';

const App = () => (
    <Router>
        <Navigation />

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
    </Router>
);

export default App;
