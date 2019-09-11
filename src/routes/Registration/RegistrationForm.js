import React from 'react';
import ButtonSelect from '../../components/ButtonSelect';
import moment from 'moment';

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
        const { members, event, onChangeEvent } = this.props;

        return (
            <div className="registration-form">
                <h1>
                    {moment(event.date).format('DD.MM.YYYY')} -{' '}
                    {event.title}
                </h1>

                <button
                    className="btn btn-link registration-form__change-event"
                    onClick={onChangeEvent}
                >
                    Endre arrangement
                </button>
                <table className="table-full-width table-hor-lines-between">
                    {members.map(member => (
                        <tr key={member.id}>
                            <td className="registration-form__member-name">
                                {member.first_name} {member.last_name}
                            </td>
                            <td className="registration-form__buttons">
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
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }
}

export default RegistrationForm;
