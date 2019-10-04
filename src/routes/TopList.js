import React from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { withAuthorization } from '../components/Session';
import * as PERMISSIONS from '../constants/permissions';

class TopListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            events: [],
            semesters: [],
            selectedSemester: '',
        };
    }

    componentDidMount() {
        this.props.firebase.members().on('value', snapshot => {
            const membersObject = snapshot.val();
            const members = Object.keys(membersObject).map(key => ({
                ...membersObject[key],
                id: key,
            }));
            this.setState({ members });
        });

        this.props.firebase.events().on('value', snapshot => {
            const eventsObject = snapshot.val();
            const events = Object.keys(eventsObject).map(key => ({
                ...eventsObject[key],
                id: key,
            }));
            this.setState({ events });
        });

        this.props.firebase.semesters().on('value', snapshot => {
            const semestersObject = snapshot.val();
            const semesters = Object.keys(semestersObject)
                .map(key => ({
                    ...semestersObject[key],
                    id: key,
                }))
                .sort(
                    (a, b) => moment(b.end_date) - moment(a.end_date),
                );

            this.setState({ semesters });
            this.setState({ selectedSemester: semesters[0] });
        });
    }

    handleSelectSemester = selectedSemesterId => {
        const s = this.state.semesters.filter(
            s => s.id === selectedSemesterId,
        )[0];
        this.setState({ selectedSemester: s });
    };

    render() {
        const {
            members,
            events,
            semesters,
            selectedSemester,
        } = this.state;
        return (
            <div className="content">
                <h1>Toppliste</h1>
                <select
                    onChange={event => {
                        return this.handleSelectSemester(
                            event.target.value,
                        );
                    }}
                    value={
                        selectedSemester ? selectedSemester.id : ''
                    }
                >
                    <option value={''}>Totalt</option>
                    {semesters.map(semester => (
                        <option value={semester.id} key={semester.id}>
                            {semester.title}
                        </option>
                    ))}
                </select>
                <TopList
                    members={members}
                    events={events}
                    start_date={
                        selectedSemester
                            ? selectedSemester.start_date
                            : '1970-01-01'
                    }
                    end_date={
                        selectedSemester
                            ? selectedSemester.end_date
                            : '4000-01-01'
                    }
                />
            </div>
        );
    }
}

const TopList = ({
    members,
    events,
    start_date,
    end_date,
    event_type = 'Øvelse',
}) => {
    if (!members || !events || !start_date || !end_date) {
        return <Spinner />;
    }

    events = events.filter(event => {
        const d = moment(event.date);
        return (
            d > moment(start_date) &&
            d < moment(end_date) &&
            (!event_type || event.type === event_type)
        );
    });

    members = members.map(member => {
        const count = events.reduce((prev, cur) => {
            if (cur.attendants && cur.attendants[member.id]) {
                return prev + 1;
            }
            return prev;
        }, 0);

        return { ...member, eventCount: count };
    });

    members = members
        .filter(m => m.eventCount > 0)
        .sort((a, b) => b.eventCount - a.eventCount);
    let placement = 0;
    let lastCount = 100000000;
    members = members.map(member => {
        if (member.eventCount < lastCount) {
            placement += 1;
            lastCount = member.eventCount;
        }

        return { ...member, placement: placement };
    });

    return (
        <table className="table-full-width table-hor-lines-between">
            <thead>
                <tr>
                    <th>Plass</th>
                    <th>Navn</th>
                    <th>Antall</th>
                </tr>
            </thead>
            <tbody>
                {members.map(member => (
                    <tr key={member.id}>
                        <td>{member.placement}</td>
                        <td>
                            {member.first_name} {member.last_name}
                        </td>
                        <td>{member.eventCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const authCondition = authUser =>
    !!authUser &&
    !!authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
    !!authUser.permissions[PERMISSIONS.EVENTS_READ] &&
    !!authUser.permissions[PERMISSIONS.SEMESTERS_READ];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(TopListPage);
