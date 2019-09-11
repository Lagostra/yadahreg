import React from 'react';
import ButtonSelect from '../../components/ButtonSelect';

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);

        this.presenceOptions = [
            {
                value: 'present',
                text: <i className="fas fa-check-circle" />,
                tooltip: 'Til stede',
            },
            {
                value: 'notified',
                text: <i className="fas fa-comment" />,
                tooltip: 'Gitt beskjed',
            },
            {
                value: 'not-present',
                text: <i className="fas fa-times-circle" />,
                tooltip: 'Ikke til stede',
            },
        ];
    }

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

export default RegistrationForm;
