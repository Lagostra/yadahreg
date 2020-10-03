import React, { useState } from 'react';
import moment from 'moment';

import { withFirebase } from '../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../components/Session';

import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import PhoneBilliard from '../components/PhoneBilliard';
import { useMembers } from 'hooks';

const MembersPage = () => {
  const [editMember, setEditMember] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [filter, setFilter] = useState('');
  const [showOnlyActiveMembers, setShowOnlyActiveMembers] = useState(true);
  const [members] = useMembers(showOnlyActiveMembers);

  const handleDeleteMember = (member) => {
    if (window.confirm(`Er du sikker på at du vil slette ${member.first_name} ${member.last_name}?`)) {
      this.props.firebase.member(member.id).remove();
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

class MemberFormBase extends React.Component {
  constructor(props) {
    super(props);

    if (props.member) {
      const member = { ...props.member };
      delete member.id;
      this.state = {
        ...member,
      };
    } else {
      this.state = {
        active: true,
        address: '',
        allergies: '',
        birthday: '',
        email: '',
        first_name: '',
        gender: '',
        last_name: '',
        phone: '',
        voice_group: '',
        gameModalActive: false,
      };
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.member !== this.props.member) {
      const member = { ...this.props.member };
      delete member.id;
      this.setState({ ...member });
    }
  }

  onChange = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    });

    if (event.currentTarget.name === 'phone' && event.currentTarget.value === '81549300') {
      this.setState({ gameModalActive: true });
    }
  };

  onCheckboxChange = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.checked,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    let memberId;

    const {
      active,
      address,
      allergies,
      birthday,
      email,
      first_name,
      gender,
      last_name,
      phone,
      voice_group,
    } = this.state;

    let member = {
      active,
      address,
      allergies,
      birthday,
      email,
      first_name,
      gender,
      last_name,
      phone,
      voice_group,
    };

    if (this.props.member) {
      // Clean up undefined values that will otherwise cause problems with Firebase
      const savedMember = JSON.parse(JSON.stringify(member));
      this.props.firebase.member(this.props.member.id).set(savedMember);
      memberId = this.props.member.id;
    } else {
      const createdAt = moment().toISOString();
      member['created_at'] = createdAt;

      const ref = this.props.firebase.members().push(member);
      memberId = ref.getKey();
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(memberId);
    }
  };

  handleModalClose = () => {
    this.setState({ gameModalActive: false });
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          active={this.state.gameModalActive}
          onClose={this.handleModalClose}
          contentStyle={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PhoneBilliard updatePhoneNumber={(phoneNumber) => this.setState({ phone: phoneNumber })} />
        </Modal>

        <form onSubmit={this.onSubmit}>
          <h1>{this.props.member ? 'Rediger medlem' : 'Nytt medlem'}</h1>

          {this.props.event && (
            <p>
              <i className="fas fa-exclamation-circle" />
              {'  '}
              Medlemmet vil automatisk bli registrert som til stede på {this.props.event.title}{' '}
              {moment(this.props.event.date).format('DD.MM.YYYY')}
            </p>
          )}

          <label htmlFor="first_name">Fornavn</label>
          <input name="first_name" value={this.state.first_name} onChange={this.onChange} type="text" />

          <label htmlFor="last_name">Etternavn</label>
          <input name="last_name" value={this.state.last_name} onChange={this.onChange} type="text" />

          {this.props.member && this.props.member.created_at && (
            <p style={{ color: 'gray' }}>Medlem siden {moment(this.props.member.created_at).format('DD.MM.YYYY')}</p>
          )}

          <label htmlFor="gender">Kjønn</label>
          <select value={this.state.gender} onChange={this.onChange} name="gender">
            <option value="" disabled>
              Velg kjønn
            </option>
            <option value="Mann">Mann</option>
            <option value="Kvinne">Kvinne</option>
          </select>

          <label htmlFor="birthday">Fødselsdato</label>
          <input name="birthday" value={this.state.birthday} onChange={this.onChange} type="date" />

          <label htmlFor="email">E-post</label>
          <input name="email" value={this.state.email} onChange={this.onChange} type="text" />

          <label htmlFor="phone">Telefon</label>
          <input name="phone" value={this.state.phone} onChange={this.onChange} type="text" />

          <label htmlFor="address">Adresse</label>
          <input name="address" value={this.state.address} onChange={this.onChange} type="text" />

          <label htmlFor="allergies">Allergier</label>
          <input name="allergies" value={this.state.allergies} onChange={this.onChange} type="text" />

          <label htmlFor="voice_group">Stemmegruppe</label>
          {['Vet ikke', 'Sopran', 'Alt', 'Tenor', 'Bass'].map((voice_group) => (
            <div key={voice_group}>
              <input
                name="voice_group"
                checked={this.state.voice_group === voice_group}
                value={voice_group}
                onChange={this.onChange}
                type="radio"
              />{' '}
              {voice_group}
            </div>
          ))}

          {this.props.member && (
            <React.Fragment>
              <label htmlFor="active">Aktiv</label>
              <input type="checkbox" checked={this.state.active} name="active" onChange={this.onCheckboxChange} />
            </React.Fragment>
          )}

          {/* 
                    Voice group, allergies, address?
                */}

          <button type="submit" className="btn">
            Lagre
          </button>
        </form>
      </React.Fragment>
    );
  }
}

const MemberForm = withFirebase(MemberFormBase);
export { MemberForm };

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_WRITE];

export default compose(withFirebase, withAuthorization(authCondition))(MembersPage);
