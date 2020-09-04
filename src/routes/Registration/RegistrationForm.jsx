import React, { useState } from 'react';
import ButtonSelect from 'components/ButtonSelect';
import moment from 'moment';
import Modal from 'components/Modal';
import { MemberForm } from '../Members';
import hasBirthday from 'util/hasBirthday';

const RegistrationForm = ({members, onRegistrationChange, event, semester, onChangeEvent}) => {
  const [filter, setFilter] = useState('');
  const [memberModalActive, setMemberModalActive] = useState(false);

  const presenceOptions = [
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

  const getStatus = (member) => {
    if (event) {
      if (event.attendants && !!event.attendants[member.id]) {
        return 'present';
      }
      if (event.non_attendants && !!event.non_attendants[member.id]) {
        return 'notified';
      }
    }
    return 'not-present';
  }

  const isMatch = (filter, name) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(name);
  }

  const handleFilterKeyDown = (e) => {
    if (e.key === 'Enter') {
      const matchingMembers = members.filter((member) => {
        const res = isMatch(filter, member.first_name + ' ' + member.last_name);
        return res;
      });
      if (matchingMembers.length === 1) {
        onRegistrationChange(matchingMembers[0], 'present');

        setTimeout(() => {
          setFilter('');
        }, 600);
      }
    }
  };

  const handleAddMember = (memberId) => {
    onRegistrationChange({id: memberId}, 'present');
    setMemberModalActive(false);
  }

  return (
    <div className="registration-form">
      <Modal onClose={() => setMemberModalActive(false)} active={memberModalActive}>
        <MemberForm onSubmit={handleAddMember} event={event} />
      </Modal>
      <div className="registration-form__header">
        <h1>
          {moment(event.date).format('DD.MM.YYYY')} - {event.title}
        </h1>

        <button className="btn btn-link registration-form__change-event" onClick={onChangeEvent}>
          Endre arrangement
        </button>
      </div>
      <div className="registration-form__util-bar">
        <div>
          <button
            onClick={() => setMemberModalActive(true)}
            className="btn"
          >
            Nytt medlem
          </button>
        </div>

        <div className="registration-form__num-attendants">
          Antall oppmøtte: {event.attendants ? Object.keys(event.attendants).length : 0}
        </div>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        name="filter"
        type="text"
        placeholder="Søk..."
        onKeyDown={handleFilterKeyDown}
      />

      <table className="registration-form__member-table table-full-width table-hor-lines-between table-last-td-right">
        <tbody>
          {members.map((member) => (
            <React.Fragment key={member.id}>
              {(!filter || isMatch(filter, member.first_name + ' ' + member.last_name)) && (
                <tr className={hasBirthday(member) ? 'registration-form__member--birthday' : ''}>
                  <td className="registration-form__member-name">
                    {member.first_name} {member.last_name}
                    {semester && semester.payees && !semester.payees[member.id] && '*'}
                  </td>
                  <td className="registration-form__buttons">
                    <ButtonSelect
                      options={presenceOptions}
                      onChange={(e) => onRegistrationChange(member, e.value)}
                      value={getStatus(member)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {semester && '* Har ikke betalt siste semesteravgift'}
    </div>
  );
}

export default RegistrationForm;
