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

        this.state = { filter: '' };
    }

    getStatus = member => {
        const { event } = this.props;
        if (event) {
            if (event.attendants && !!event.attendants[member.id]) {
                return 'present';
            }
            if (
                event.non_attendants &&
                !!event.non_attendants[member.id]
            ) {
                return 'notified';
            }
        }
        return 'not-present';
    };

    isMatch = (filter, name) => {
        const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
        return regex.test(name);
    };

    handleFilterChange = e => {
        this.setState({ filter: e.target.value });
    };

    handleFilterKeyDown = e => {
        const { members, onRegistrationChange } = this.props;
        const { filter } = this.state;
        if (e.key === 'Enter') {
            const matchingMembers = members.filter(member => {
                const res = this.isMatch(
                    filter,
                    member.first_name + ' ' + member.last_name,
                );
                return res;
            });
            if (matchingMembers.length === 1) {
                onRegistrationChange(matchingMembers[0], 'present');

                setTimeout(() => {
                    this.setState({ filter: '' });
                }, 600);
            }
        }
    };

    render() {
        const { members, event, onChangeEvent } = this.props;
        const { filter } = this.state;

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

                <div className="registration-form__num-attendants">
                    Antall oppmøtte:{' '}
                    {event.attendants
                        ? Object.keys(event.attendants).length
                        : 0}
                </div>

                <input
                    value={filter}
                    onChange={this.handleFilterChange}
                    name="filter"
                    type="text"
                    placeholder="Søk..."
                    onKeyDown={this.handleFilterKeyDown}
                />

                <table className="table-full-width table-hor-lines-between">
                    <tbody>
                        {members.map(member => (
                            <React.Fragment key={member.id}>
                                {(!filter ||
                                    this.isMatch(
                                        filter,
                                        member.first_name +
                                            ' ' +
                                            member.last_name,
                                    )) && (
                                    <tr>
                                        <td className="registration-form__member-name">
                                            {member.first_name}{' '}
                                            {member.last_name}
                                        </td>
                                        <td className="registration-form__buttons">
                                            <ButtonSelect
                                                options={
                                                    this
                                                        .presenceOptions
                                                }
                                                onChange={e =>
                                                    this.props.onRegistrationChange(
                                                        member,
                                                        e.value,
                                                    )
                                                }
                                                value={this.getStatus(
                                                    member,
                                                )}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RegistrationForm;
