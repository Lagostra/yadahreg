import React from 'react';
import ButtonSelect from './../../components/ButtonSelect';

class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.paymentOptions = [
            {
                value: 'paid',
                text: 'Har betalt',
                toolTip: 'Har betalt',
            },
            {
                value: 'not-paid',
                text: 'Har ikke betalt',
                toolTip: 'Har ikke betalt',
            },
        ];

        this.state = { filter: '' };
    }

    getStatus = member => {
        const { semester } = this.props;

        if (semester) {
            if (semester.payees && !!semester.payees[member.id]) {
                return 'paid';
            }
        }
        return 'not-paid';
    };

    isMatch = (filter, name) => {
        const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
        return regex.test(name);
    };

    handleFilterChange = e => {
        this.setState({ fitler: e.target.value });
    };

    render() {
        const { members, semester, onChangeSemester } = this.props;
        const { filter } = this.state;

        return (
            <div className="payment-form">
                <div className="payment-form__header">
                    <h1>{semester.title}</h1>
                </div>

                <button
                    className="btn btn-link payment-form__change-semester"
                    onClick={onChangeSemester}
                >
                    Endre semester
                </button>

                <input
                    value={filter}
                    onChange={this.handleFilterChange}
                    name="filter"
                    type="text"
                    placeholder="Søk..."
                />

                <table className="payment-form__member-table table-full-width table-hor-lines-between">
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
                                        <td className="payment-form__member-name">
                                            {member.first_name}{' '}
                                            {member.last_name}
                                        </td>
                                        <td className="payment-form__buttons">
                                            <ButtonSelect
                                                options={
                                                    this
                                                        .paymentOptions
                                                }
                                                onChange={e =>
                                                    this.props.onPaymentChange(
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

export default PaymentForm;
