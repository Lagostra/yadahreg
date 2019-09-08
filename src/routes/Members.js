import React from 'react';
import { withFirebase } from '../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../components/Session';

import * as PERMISSIONS from '../constants/permissions';

class MembersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
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
    }

    render() {
        return (
            <div className="content">
                <h1>Medlemmer</h1>
                <MembersList members={this.state.members} />
            </div>
        );
    }
}

const MembersList = ({ members }) => (
    <ul>
        {members.map(member => (
            <li>
                {member.first_name} {member.last_name}
            </li>
        ))}
    </ul>
);

const MemberForm = ({ onSubmit, member, title }) => {
    return (
        <form>
            <h1>{title}</h1>
        </form>
    );
};

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_WRITE];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(MembersPage);
