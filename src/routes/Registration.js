import React from 'react';
import { withFirebase } from '../components/Firebase';
import ButtonSelect from '../components/ButtonSelect';

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            event: null,
        };

        this.presenceOptions = [
            {
                value: 'present',
                text: <i className="fas fa-check-circle" />,
            },
            {
                value: 'notified',
                text: <i className="fas fa-comment" />,
            },
            {
                value: 'not-present',
                text: <i className="fas fa-times-circle" />,
            },
        ];
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

    handleChange = (member, value) => {
        console.log(member.first_name, value);
    };

    render() {
        const { event, members } = this.state;
        return (
            <div className="content">
                {event && (
                    <RegistrationForm
                        onRegistrationChange={this.handleChange}
                        members={members}
                        event={event}
                    />
                )}
            </div>
        );
    }
}

class RegistrationForm extends React.Component {
    getStatus = member => {
        const { event } = this.props;
        if (event) {
            if (event.participants && event.participants[member.id]) {
                return 'present';
            }
            if (
                event.non_participants &&
                event.non_participants[member.id]
            ) {
                return 'notified';
            }
        }
        return 'not-present';
    };

    render() {
        const { members } = this.props;

        return (
            <div className="registration-form">
                {members.map(member => (
                    <div key={member.id}>
                        {member.first_name} {member.last_name}
                        <ButtonSelect
                            options={this.presenceOptions}
                            onChange={value =>
                                this.props.onRegistrationChange(
                                    member,
                                    value,
                                )
                            }
                            value={this.getStatus(member)}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export { RegistrationForm };
export default withFirebase(RegistrationPage);
