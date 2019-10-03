import React from 'react';
import moment from 'moment';
import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';

class InactiveMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inactiveMembers: [],
            loaded: false,
        };
    }

    componentDidMount() {
        const memberPromise = this.props.firebase
            .members()
            .once('value')
            .then(snapshot => {
                const membersObject = snapshot.val();
                const members = Object.keys(membersObject)
                    .map(key => ({
                        ...membersObject[key],
                        id: key,
                    }))
                    .filter(m => m.active);

                return members;
            });

        const eventsPromise = this.props.firebase
            .events()
            .once('value')
            .then(snapshot => {
                const eventsObject = snapshot.val();
                let events = Object.keys(eventsObject)
                    .map(key => ({
                        ...eventsObject[key],
                        id: key,
                    }))
                    .filter(
                        event =>
                            event.type && event.type === 'Øvelse',
                    )
                    .sort((a, b) => moment(b.date) - moment(a.date));

                const lastThree = events.slice(0, 3);
                const thisYear = moment().year();
                const semesterStart =
                    moment() <= moment([thisYear, 6, 31])
                        ? moment([thisYear, 0, 1])
                        : moment([thisYear, 7, 1]);
                events = events.filter(
                    event => moment(event.date) > semesterStart,
                );
                events = events.length >= 3 ? events : lastThree;

                return events;
            });

        Promise.all([memberPromise, eventsPromise]).then(
            ([members, events]) => {
                members = members.map(member => {
                    let totalAbsent = 0;
                    let absentFromLast = true;
                    let absentInRow = 0;
                    let lastPresent = null;
                    events.forEach(event => {
                        if (
                            !event.attendants ||
                            !event.attendants[member.id]
                        ) {
                            totalAbsent += 1;

                            if (
                                !event.non_attendants ||
                                !event.non_attendants[member.id]
                            ) {
                                if (absentFromLast) {
                                    absentInRow += 1;
                                } else {
                                    absentFromLast = false;
                                }
                            }
                        } else {
                            if (!lastPresent) {
                                lastPresent = event.date;
                            }
                        }
                    });

                    const inactive =
                        absentInRow >= 3 || totalAbsent >= 6;

                    return {
                        ...member,
                        inactive,
                        lastPresent,
                        absentInRow,
                        totalAbsent,
                    };
                });

                const inactiveMembers = members
                    .filter(m => m.inactive)
                    .sort((a, b) => {
                        if (!b.lastPresent && !a.lastPresent) {
                            return 0;
                        }
                        if (!b.lastPresent) {
                            return 1;
                        }
                        if (!a.lastPresent) {
                            return -1;
                        }
                        return (
                            moment(a.lastPresent) -
                            moment(b.lastPresent)
                        );
                    });

                console.log(inactiveMembers);

                this.setState({ inactiveMembers, loaded: true });
            },
        );
    }

    render() {
        const { inactiveMembers, loaded } = this.state;

        return (
            <div className="content">
                <h1>Inaktive medlemmer</h1>
                {!loaded && <Spinner />}
                {loaded &&
                    'Medlemskapet til de følgende kormedlemmene er regnet som avsluttet jf. korets vedtekter (§3.5).'}
                {loaded && inactiveMembers.length && (
                    <table className="table-full-width table-hor-lines-between">
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Siste øvelse</th>
                                <th className="desktop-only">
                                    Fravær dette semester
                                </th>
                                <th className="desktop-only">
                                    Fravær på rad
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveMembers.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        {member.first_name}{' '}
                                        {member.last_name}
                                    </td>
                                    <td>
                                        {member.lastPresent
                                            ? moment(
                                                  member.lastPresent,
                                              ).format('DD.MM.YYYY')
                                            : 'Ingen dette semesteret'}
                                    </td>
                                    <td className="desktop-only">
                                        {member.totalAbsent}
                                    </td>
                                    <td className="desktop-only">
                                        {member.absentInRow}
                                    </td>
                                    <td>
                                        {/*<button
                                            className="btn btn-small"
                                            onClick={() =>
                                                onEditMember(member)
                                            }
                                        >
                                            <i className="fas fa-edit" />
                                        </button>
                                        <button
                                            className="btn btn-small btn-danger"
                                            onClick={() =>
                                                onDeleteMember(member)
                                            }
                                        >
                                            <i className="fas fa-trash-alt" />
                                        </button>*/}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default withFirebase(InactiveMembers);
