import React from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';
import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import { withAuthorization } from '../components/Session';

class Allergies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            loaded: false,
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        firebase.members().on('value', snapshot => {
            const membersObject = snapshot.val();

            const members = Object.keys(membersObject)
                .map(key => ({
                    ...membersObject[key],
                    id: key,
                }))
                .filter(member => member.active)
                .filter(member => member.allergies)
                .sort((a, b) => {
                    const a1 = (
                        a.first_name + a.last_name
                    ).toLowerCase();
                    const b1 = (
                        b.first_name + b.last_name
                    ).toLowerCase();
                    if (a1 < b1) return -1;
                    if (b1 < a1) return 1;
                    return 0;
                });

            this.setState({ members, loaded: true });
        });
    }

    componentWillUnmount() {
        const { firebase } = this.state;
        firebase.members().off();
    }

    render() {
        const { members, loaded } = this.state;

        return (
            <div className="content">
                <h1>Allergier</h1>
                {!loaded && <Spinner />}
                {loaded && members.length && (
                    <table className="table-full-width table-hor-lines-between">
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Allergi(er)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        {member.first_name}{' '}
                                        {member.last_name}
                                    </td>
                                    <td>{member.allergies}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_READ];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(Allergies);
