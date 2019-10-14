import React from 'react';
import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';
import moment from 'moment';

class AttendanceOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            events: [],
            startDate: moment()
                .subtract(30, 'd')
                .toDate(),
            endDate: moment()
                .add(1, 'd')
                .toDate(),
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
    }

    componentWillUnmount() {
        this.props.firebase.members().off();
        this.props.firebase.events().off();
    }

    render() {
        const { members, events, startDate, endDate } = this.state;

        const filteredEvents = events.filter(
            event =>
                moment(event.date) > moment(startDate) &&
                moment(event.date) < moment(endDate),
        );

        const filteredMembers = members.filter(
            member => member.active,
        );

        return (
            <div className="content">
                {(!members.length || !events.length) && <Spinner />}
                {!!members.length && !!events.length && (
                    <div className="table-scroll-container">
                        <table className="table-full-width table-hor-lines-between">
                            <thead>
                                <tr>
                                    <th>Navn</th>
                                    {filteredEvents.map(event => (
                                        <th key={event.id}>
                                            {moment(
                                                event.date,
                                            ).format('DD.MM.YYYY')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <i>Antall oppmøtte</i>
                                    </td>
                                    {filteredEvents.map(event => (
                                        <td key={event.id}>
                                            {event.attendants
                                                ? Object.keys(
                                                      event.attendants,
                                                  ).length
                                                : 0}
                                        </td>
                                    ))}
                                </tr>
                                {filteredMembers.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            {member.first_name}{' '}
                                            {member.last_name}
                                        </td>
                                        {filteredEvents.map(event => (
                                            <td key={event.id}>
                                                {event.attendants &&
                                                !!event.attendants[
                                                    member.id
                                                ]
                                                    ? 'Y'
                                                    : event.non_attendants &&
                                                      !!event
                                                          .non_attendants[
                                                          member.id
                                                      ]
                                                    ? 'N'
                                                    : ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default withFirebase(AttendanceOverview);