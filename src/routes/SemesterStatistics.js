import React from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';
import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';

class SemesterStatistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            semesters: [],
            events: [],
            selectedSemester: null,
        };
    }

    componentDidMount() {
        this.props.firebase.semesters().on('value', snapshot => {
            const semestersObject = snapshot.val();
            const semesters = Object.keys(semestersObject).map(
                key => ({
                    ...semestersObject[key],
                    uid: key,
                }),
            );
            this.setState({ semesters });
        });

        this.props.firebase.events().on('value', snapshot => {
            const eventsObject = snapshot.val();
            const events = Object.keys(eventsObject).map(key => ({
                ...eventsObject[key],
                uid: key,
            }));
            this.setState({ events });
        });
    }

    componentWillUnmount() {
        this.props.firebase.semesters().off();
        this.props.firebase.events().off();
    }

    render() {
        const { semesters, events } = this.props;

        return (
            <div className="content">
                <h1>Semesterstatistikk</h1>
            </div>
        );
    }
}

const authCondition = authUser =>
    !!authUser &&
    !!authUser.permissions[PERMISSIONS.EVENTS_READ] &&
    !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(SemesterStatistics);
