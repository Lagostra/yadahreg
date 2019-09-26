import React from 'react';
import moment from 'moment';

import { withFirebase } from '../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../components/Session';

import * as PERMISSIONS from '../constants/permissions';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';

class MembersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            editMember: null,
            modalActive: false,
            filter: '',
            showOnlyActiveMembers: true,
        };
    }

    componentDidMount() {
        this.props.firebase.members().on('value', snapshot => {
            const membersObject = snapshot.val();
            const members = Object.keys(membersObject)
                .map(key => ({
                    ...membersObject[key],
                    id: key,
                }))
                .sort((a, b) => {
                    const a1 = (
                        a.first_name + a.last_name
                    ).toLowerCase();
                    const b1 = (
                        b.first_name + b.last_name
                    ).toLowerCase();
                    if (a1 < b1) return -1;
                    if (b1 < a1) return 1;
                    return 0;
                });

            this.setState({ members });
        });
    }

    componentWillUnmount() {
        this.props.firebase.members().off();
    }

    handleModalClose = () => {
        this.setState({ modalActive: false });
    };

    handleEditMember = member => {
        this.setState({ editMember: member, modalActive: true });
    };

    handleDeleteMember = member => {
        if (
            window.confirm(
                `Er du sikker på at du vil slette ${member.first_name} ${member.last_name}?`,
            )
        ) {
            this.props.firebase.member(member.id).remove();
        }
    };

    handleFilterChange = e => {
        this.setState({ filter: e.target.value });
    };

    render() {
        const {
            members,
            modalActive,
            editMember,
            filter,
            showOnlyActiveMembers,
        } = this.state;
        return (
            <div className="content">
                <h1>Medlemmer</h1>
                <Modal
                    active={modalActive}
                    onClose={this.handleModalClose}
                >
                    <MemberForm
                        member={editMember}
                        onSubmit={this.handleModalClose}
                    />
                </Modal>

                <button
                    className="btn"
                    onClick={() => {
                        this.setState({
                            editMember: null,
                            modalActive: true,
                        });
                    }}
                >
                    Nytt medlem
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        this.setState({
                            showOnlyActiveMembers: !showOnlyActiveMembers,
                        });
                    }}
                >
                    {showOnlyActiveMembers
                        ? 'Vis inaktive medlemmer'
                        : 'Vis bare aktive medlemmer'}
                </button>
                {!members.length && <Spinner />}
                {!!members.length && (
                    <React.Fragment>
                        <input
                            value={filter}
                            onChange={this.handleFilterChange}
                            name="filter"
                            type="text"
                            placeholder="Søk..."
                            style={{ marginTop: '25px' }}
                        />

                        <MembersList
                            members={members}
                            onEditMember={this.handleEditMember}
                            onDeleteMember={this.handleDeleteMember}
                            filter={filter}
                            showOnlyActiveMembers={
                                showOnlyActiveMembers
                            }
                        />
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const MembersList = ({
    members,
    onEditMember,
    onDeleteMember,
    filter,
    showOnlyActiveMembers,
}) => {
    const isMatch = (filter, name) => {
        const regex = new RegExp('(.*)' + filter + '(.*)', 'i');
        return regex.test(name);
    };

    return (
        <table className="table-full-width table-hor-lines-between">
            <thead>
                <tr>
                    <th>Navn</th>
                    <th className="desktop-only">E-post</th>
                    <th className="desktop-only">Telefon</th>
                </tr>
            </thead>
            <tbody>
                {members.map(member => (
                    <React.Fragment key={member.id}>
                        {(!filter ||
                            isMatch(
                                filter,
                                member.first_name +
                                    ' ' +
                                    member.last_name,
                            )) &&
                            (!showOnlyActiveMembers ||
                                !!member.active) && (
                                <tr>
                                    <td>
                                        {member.first_name}{' '}
                                        {member.last_name}
                                    </td>
                                    <td className="desktop-only">
                                        {member.email}
                                    </td>
                                    <td className="desktop-only">
                                        {member.phone}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-small"
                                            onClick={() =>
                                                onEditMember(member)
                                            }
                                        >
                                            <i className="fas fa-edit" />
                                        </button>
                                        <button
                                            className="btn btn-small btn-danger"
                                            onClick={() =>
                                                onDeleteMember(member)
                                            }
                                        >
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
                birthdate: '',
                email: '',
                first_name: '',
                gender: '',
                last_name: '',
                phone: '',
                voice_group: '',
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

    onChange = event => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value,
        });
    };

    onCheckboxChange = event => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.checked,
        });
    };

    onSubmit = event => {
        event.preventDefault();
        let memberId;
        if (this.props.member) {
            this.props.firebase
                .member(this.props.member.id)
                .set(this.state);
            memberId = this.props.member.id;
        } else {
            const ref = this.props.firebase
                .members()
                .push(this.state);
            memberId = ref.getKey();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(memberId);
        }
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>
                    {this.props.member
                        ? 'Rediger medlem'
                        : 'Nytt medlem'}
                </h1>

                {this.props.event && (
                    <p>
                        <i className="fas fa-exclamation-circle" />
                        {'  '}
                        Medlemmet vil automatisk bli registrert som
                        til stede på {this.props.event.title}{' '}
                        {moment(this.props.event.date).format(
                            'DD.MM.YYYY',
                        )}
                    </p>
                )}

                <label htmlFor="first_name">Fornavn</label>
                <input
                    name="first_name"
                    value={this.state.first_name}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="last_name">Etternavn</label>
                <input
                    name="last_name"
                    value={this.state.last_name}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="gender">Kjønn</label>
                <select
                    value={this.state.gender}
                    onChange={this.onChange}
                    name="gender"
                >
                    <option value="" disabled>
                        Velg kjønn
                    </option>
                    <option value="Mann">Mann</option>
                    <option value="Kvinne">Kvinne</option>
                </select>

                <label htmlFor="birthdate">Fødselsdato</label>
                <input
                    name="birthdate"
                    value={this.state.birthdate}
                    onChange={this.onChange}
                    type="date"
                />

                <label htmlFor="email">E-post</label>
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="phone">Telefon</label>
                <input
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="allergies">Allergier</label>
                <input
                    name="allergies"
                    value={this.state.allergies}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="voice_group">Stemmegruppe</label>
                {['Vet ikke', 'Sopran', 'Alt', 'Tenor', 'Bass'].map(
                    voice_group => (
                        <div key={voice_group}>
                            <input
                                name="voice_group"
                                checked={
                                    this.state.voice_group ===
                                    voice_group
                                }
                                value={voice_group}
                                onChange={this.onChange}
                                type="radio"
                            />{' '}
                            {voice_group}
                        </div>
                    ),
                )}

                {this.props.member && (
                    <React.Fragment>
                        <label htmlFor="active">Aktiv</label>
                        <input
                            type="checkbox"
                            checked={this.state.active}
                            name="active"
                            onChange={this.onCheckboxChange}
                        />
                    </React.Fragment>
                )}

                {/* 
                    Voice group, allergies, address?
                */}

                <button type="submit" className="btn">
                    Lagre
                </button>
            </form>
        );
    }
}

const MemberForm = withFirebase(MemberFormBase);
export { MemberForm };

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_WRITE];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(MembersPage);
