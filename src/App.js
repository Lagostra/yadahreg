import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withFirebase } from './components/Firebase';

import Navigation from './components/Navigation';
import LandingPage from './views/LandingPage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? this.setState({ authUser })
                    : this.setState({ authUser: null });
            },
        );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <Router>
                <Navigation authUser={this.state.authUser} />

                <hr />

                <Route
                    exact
                    path={ROUTES.LANDING}
                    component={LandingPage}
                />
                <Route path={ROUTES.SIGN_IN} component={SignIn} />
                <Route path={ROUTES.SIGN_UP} component={SignUp} />
            </Router>
        );
    }
}

export default withFirebase(App);
