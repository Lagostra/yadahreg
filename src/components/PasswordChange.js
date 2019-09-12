import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from './Firebase';
import { withAuthorization } from './Session';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        event.preventDefault();

        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Nytt passord"
                />

                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Bekreft nytt passord"
                />

                <button
                    disabled={isInvalid}
                    type="submit"
                    className="btn"
                >
                    Endre passord
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const authCondition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(PasswordChangeForm);
