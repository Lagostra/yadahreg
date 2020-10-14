import React, { useState } from 'react';
import ButtonSelect from '../../components/ButtonSelect';

const PAYMENT_OPTIONS = [
  {
    value: 'paid',
    text: (
      <i
        className="fas fa-money-bill"
        style={{
          fontSize: '1.5em',
          lineHeight: '1em',
        }}
      />
    ),
    toolTip: 'Har betalt',
  },
  {
    value: 'not-paid',
    text: (
      <span
        className="fa-stack"
        style={{
          fontSize: '0.75em',
        }}
      >
        <i className="fas fa-money-bill fa-stack-1x" />
        <i className="fas fa-ban fa-stack-2x" />
      </span>
    ),
    toolTip: 'Har ikke betalt',
  },
];

const PaymentForm = ({ semester, members, onPaymentChange, onChangeSemester }) => {
  const [filter, setFilter] = useState('');

  const getStatus = (member) => {
    if (semester) {
      if (semester.payees && !!semester.payees[member.id]) {
        return 'paid';
      }
    }
    return 'not-paid';
  };

  const isMatch = (filter, name) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(name);
  };

  const handleFilterKeyDown = (e) => {
    if (e.key === 'Enter') {
      const matchingMembers = members.filter((member) => {
        const res = this.isMatch(filter, member.first_name + ' ' + member.last_name);
        return res;
      });
      if (matchingMembers.length === 1) {
        onPaymentChange(matchingMembers[0], 'paid');

        setTimeout(() => setFilter(''), 600);
      }
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-form__header">
        <h1>{semester.title}</h1>
      </div>

      <button className="btn btn-link payment-form__change-semester" onClick={onChangeSemester}>
        Endre semester
      </button>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={handleFilterKeyDown}
        name="filter"
        type="text"
        placeholder="Søk..."
      />

      <table className="payment-form__member-table table-full-width table-hor-lines-between table-last-td-right">
        <tbody>
          {members.map((member) => (
            <React.Fragment key={member.id}>
              {(!filter || isMatch(filter, member.first_name + ' ' + member.last_name)) && (
                <tr>
                  <td className="payment-form__member-name">
                    {member.first_name} {member.last_name}
                  </td>
                  <td className="payment-form__buttons">
                    <ButtonSelect
                      options={PAYMENT_OPTIONS}
                      onChange={(e) => onPaymentChange(member, e.value)}
                      value={getStatus(member)}
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
};

export default PaymentForm;
