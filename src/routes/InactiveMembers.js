import React from 'react';
import moment from 'moment';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { MemberForm } from './Members';
import * as PERMISSIONS from '../constants/permissions';
import { withAuthorization } from '../components/Session';
import { withAuthUser } from '../components/Session';

class InactiveMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inactiveMembers: [],
            loaded: false,
            modalActive: false,
            editMember: null,
            semester: null,
        };
    }

    componentDidMount() {
        const semesterPromise =
            !!this.props.authUser &&
            !!this.props.authUser.permissions[
                PERMISSIONS.SEMESTERS_READ
            ]
                ? this.props.firebase
                      .semesters()
                      .once('value')
                      .then(snapshot => {
                          const semestersObject = snapshot.val();
                          const semesters = Object.keys(
                              semestersObject,
                          ).map(key => ({
                              ...semestersObject[key],
                              id: key,
                          }));

                          const lastSemester = semesters.reduce(
                              (a, b) =>
                                  moment(a.end_date) >
                                  moment(b.end_data)
                                      ? a
                                      : b,
                          );

                          this.setState({ semester: lastSemester });
                      })
                : Promise.resolve();

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

        Promise.all([
            memberPromise,
            eventsPromise,
            semesterPromise,
        ]).then(([members, events]) => {
            members = members.map(member => {
                let totalAbsent = 0;
                let absentFromLast = true;
                let absentInRow = 0;
                let maxAbsentInRow = 0;
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
                                if (absentInRow > maxAbsentInRow) {
                                    maxAbsentInRow = absentInRow;
                                }
                            } else {
                                absentFromLast = true;
                            }
                        }
                    } else {
                        absentFromLast = false;
                        absentInRow = 0;
                        if (!lastPresent) {
                            lastPresent = event.date;
                        }
                    }
                });

                const inactive =
                    maxAbsentInRow >= 3 || totalAbsent >= 6;

                return {
                    ...member,
                    inactive,
                    lastPresent,
                    absentInRow: maxAbsentInRow,
                    totalAbsent,
                };
            });

            const inactiveMembers = members
                .filter(m => m.inactive)
                .sort((a, b) => b.totalAbsent - a.totalAbsent)
                .sort((a, b) => b.absentInRow - a.absentInRow)
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
                        moment(a.lastPresent) - moment(b.lastPresent)
                    );
                });

            this.setState({ inactiveMembers, loaded: true });
        });
    }

    handleModalClose = memberId => {
        this.setState({ modalActive: false });
        if (memberId) {
            this.props.firebase
                .member(memberId)
                .once('value')
                .then(snapshot => {
                    if (!snapshot.val().active) {
                        this.setState({
                            inactiveMembers: this.state.inactiveMembers.filter(
                                m => m.id !== memberId,
                            ),
                        });
                    }
                });
        }
    };

    handleEditMember = member => {
        this.setState({ editMember: member, modalActive: true });
    };

    render() {
        const {
            inactiveMembers,
            loaded,
            modalActive,
            editMember,
            semester,
        } = this.state;

        return (
            <React.Fragment>
                <Modal
                    active={modalActive}
                    onClose={this.handleModalClose}
                >
                    <MemberForm
                        member={editMember}
                        onSubmit={this.handleModalClose}
                    />
                </Modal>
                <div className="content">
                    <h1>Inaktive medlemmer</h1>
                    {!loaded && <Spinner />}
                    {loaded &&
                        'Medlemskapet til de følgende kormedlemmene er regnet som avsluttet jf. korets vedtekter (§3.5).'}
                    {loaded && !!inactiveMembers.length && (
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
                                    {semester && (
                                        <th className="desktop-only">
                                            Betalt semesteravgift
                                        </th>
                                    )}
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
                                                  ).format(
                                                      'DD.MM.YYYY',
                                                  )
                                                : 'Ingen dette semesteret'}
                                        </td>
                                        <td className="desktop-only">
                                            {member.totalAbsent}
                                        </td>
                                        <td className="desktop-only">
                                            {member.absentInRow}
                                        </td>
                                        {semester && (
                                            <td className="desktop-only">
                                                {semester.payees &&
                                                semester.payees[
                                                    member.id
                                                ]
                                                    ? 'Ja'
                                                    : 'Nei'}
                                            </td>
                                        )}
                                        <td>
                                            <button
                                                className="btn btn-small"
                                                onClick={() =>
                                                    this.handleEditMember(
                                                        member,
                                                    )
                                                }
                                            >
                                                <i className="fas fa-edit" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

const authCondition = authUser =>
    !!authUser &&
    !!authUser.permissions[PERMISSIONS.MEMBERS_READ] &&
    !!authUser.permissions[PERMISSIONS.EVENTS_READ];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
    withAuthUser,
)(InactiveMembers);
