import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { withAuthorization } from '../components/Session';

import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import PhoneBilliard from '../components/PhoneBilliard';
import { useFirebase, useMembers } from 'hooks';

const MembersPage = () => {
  const [editMember, setEditMember] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [filter, setFilter] = useState('');
  const [showOnlyActiveMembers, setShowOnlyActiveMembers] = useState(true);
  const [members] = useMembers(showOnlyActiveMembers);

  const firebase = useFirebase();

  const handleDeleteMember = (member) => {
    if (window.confirm(`Er du sikker på at du vil slette ${member.first_name} ${member.last_name}?`)) {
      firebase.member(member.id).remove();
    }
  };

  return (
    <div className="content">
      <h1>Medlemmer</h1>
      <Modal active={modalActive} onClose={() => setModalActive(false)}>
        <MemberForm member={editMember} onSubmit={() => setModalActive(false)} />
      </Modal>

      <button
        className="btn"
        onClick={() => {
          setEditMember(null);
          setModalActive(true);
        }}
      >
        Nytt medlem
      </button>
      <button
        className="btn"
        onClick={() => setShowOnlyActiveMembers(!showOnlyActiveMembers)}
      >
        {showOnlyActiveMembers ? 'Vis inaktive medlemmer' : 'Vis bare aktive medlemmer'}
      </button>
      {!members && <Spinner />}
      {!!members && (
        <>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            name="filter"
            type="text"
            placeholder="Søk..."
            style={{ marginTop: '25px' }}
          />

          <MembersList
            members={members}
            onEditMember={member => {setEditMember(member); setModalActive(true);}}
            onDeleteMember={handleDeleteMember}
            filter={filter}
            showOnlyActiveMembers={showOnlyActiveMembers}
          />
        </>
      )}
    </div>
  );
} 

const MembersList = ({ members, onEditMember, onDeleteMember, filter, showOnlyActiveMembers }) => {
  const isMatch = (filter, name) => {
    const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
    return regex.test(name);
  };

  return (
    <table className="table-full-width table-hor-lines-between table-last-td-right">
      <thead>
        <tr>
          <th>Navn</th>
          <th className="desktop-only">E-post</th>
          <th className="desktop-only">Telefon</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            {(!filter || isMatch(filter, member.first_name + ' ' + member.last_name)) &&
              (!showOnlyActiveMembers || !!member.active) && (
                <tr>
                  <td>
                    {member.first_name} {member.last_name}
                  </td>
                  <td className="desktop-only">{member.email}</td>
                  <td className="desktop-only">{member.phone}</td>
                  <td>
                    <button className="btn btn-small" onClick={() => onEditMember(member)}>
                      <i className="fas fa-edit" />
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => onDeleteMember(member)}>
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export const MemberForm = ({member: memberProp, onSubmit, event}) => {
  const [active, setActive] = useState(true);
  const [address, setAddress] = useState('');
  const [allergies, setAllergies] = useState('');
  const [birthday, setBirthday] = useState('1995-01-01');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [voiceGroup, setVoiceGroup] = useState('');
  const [gameModalActive, setGameModalActive] = useState(false);

  const firebase = useFirebase();

  useEffect(() => {
    if (memberProp) {
      setActive(memberProp.active);
      setAddress(memberProp.address);
      setAllergies(memberProp.allergies);
      setBirthday(memberProp.birthday);
      setEmail(memberProp.email);
      setFirstName(memberProp.first_name);
      setGender(memberProp.gender);
      setLastName(memberProp.last_name);
      setPhone(memberProp.phone);
      setVoiceGroup(memberProp.voice_group);
    } else {
      setActive(true);
      setAddress('');
      setAllergies('');
      setBirthday('1995-01-01');
      setEmail('');
      setFirstName('');
      setGender('');
      setLastName('');
      setPhone('');
      setVoiceGroup('');
    }
  }, [memberProp])

  const handleSubmit = (event) => {
    event.preventDefault();
    let memberId;
    let member = {
      active, address, allergies, birthday, email,
      first_name: firstName, gender, last_name: lastName, phone, voice_group: voiceGroup
    }

    if (memberProp) {
      memberId = memberProp.id;

      // Clean up undefined values that will otherwise cause problems with Firebase
      const savedMember = JSON.parse(JSON.stringify(member));
      firebase.member(memberId).set(savedMember);
    } else {
      const createdAt = moment().toISOString();
      member = {...member, 'created_at': createdAt};

      const ref = firebase.members().push(member);
      memberId = ref.getKey();
    }
    if (onSubmit) {
      onSubmit(memberId);
    }
  }

  return (
    <>
      <Modal
        active={gameModalActive}
        onClose={() => setGameModalActive(false)}
        contentStyle={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PhoneBilliard updatePhoneNumber={(phoneNumber) => setPhone(phoneNumber)} />
      </Modal>

      <form onSubmit={handleSubmit}>
        <h1>{!!memberProp ? 'Rediger medlem' : 'Nytt medlem'}</h1>

        {!!event && (
          <p>
            <i className="fas fa-exclamation-circle" />
            {'  '}
            Medlemmet vil automatisk bli registrert som til stede på {event.title}{' '}
            {moment(event.date).format('DD.MM.YYYY')}
          </p>
        )}

        <label htmlFor="first_name">Fornavn</label>
        <input name="first_name" value={firstName} onChange={e => setFirstName(e.target.value)} type="text" />

        <label htmlFor="last_name">Etternavn</label>
        <input name="last_name" value={lastName} onChange={e => setLastName(e.target.value)} type="text" />

        {!!memberProp && memberProp.created_at && (
          <p style={{ color: 'gray' }}>Medlem siden {moment(memberProp.created_at).format('DD.MM.YYYY')}</p>
        )}

        <label htmlFor="gender">Kjønn</label>
        <select value={gender} onChange={e => setGender(e.target.value)} name="gender">
          <option value="" disabled>
            Velg kjønn
          </option>
          <option value="Mann">Mann</option>
          <option value="Kvinne">Kvinne</option>
        </select>

        <label htmlFor="birthday">Fødselsdato</label>
        <input name="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} type="date" />

        <label htmlFor="email">E-post</label>
        <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="text" />

        <label htmlFor="phone">Telefon</label>
        <input name="phone" value={phone} onChange={e => {
          setPhone(e.target.value);
          if (e.target.value === '81549300') setGameModalActive(true);
        }} type="text" />

        <label htmlFor="address">Adresse</label>
        <input name="address" value={address} onChange={e => setAddress(e.target.value)} type="text" />

        <label htmlFor="allergies">Allergier</label>
        <input name="allergies" value={allergies} onChange={e => setAllergies(e.target.value)} type="text" />

        <label htmlFor="voice_group">Stemmegruppe</label>
        {['Vet ikke', 'Sopran', 'Alt', 'Tenor', 'Bass'].map((vg) => (
          <div key={vg}>
            <input
              name="voice_group"
              checked={voiceGroup === vg}
              value={vg}
              onChange={e => setVoiceGroup(e.currentTarget.value)}
              type="radio"
            />{' '}
            {vg}
          </div>
        ))}

        {!!memberProp && (
          <>
            <label htmlFor="active">Aktiv</label>
            <input type="checkbox" checked={active} name="active" onChange={e => setActive(e.currentTarget.checked)} />
          </>
        )}

        <button type="submit" className="btn">
          Lagre
        </button>
      </form>
    </>
  );
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_WRITE];

export default withAuthorization(authCondition)(MembersPage);
