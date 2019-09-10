import React from 'react';
import { withFirebase } from '../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../components/Session';

import * as PERMISSIONS from '../constants/permissions';

class MembersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
        };
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

    render() {
        return (
            <div className="content">
                <h1>Medlemmer</h1>
                <MemberForm />

                <br />
                <br />
                <br />
                <br />
                <MembersList members={this.state.members} />
            </div>
        );
    }
}

const MembersList = ({ members }) => (
    <ul>
        {members.map(member => (
            <li key={member.id}>
                {member.first_name} {member.last_name}
            </li>
        ))}
    </ul>
);

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

        if (this.props.member) {
            this.props.firebase
                .member(this.props.member.id)
                .set(this.state);
        } else {
            this.props.firebase.members().push(this.state);
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
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

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_WRITE];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(MembersPage);
