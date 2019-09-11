import React from 'react';
import { withFirebase } from '../../components/Firebase';
import RegistrationForm from './RegistrationForm';
import EventSelector from './EventSelector';

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            event: null,
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

    componentWillUnmount() {
        this.props.firebase.members().off();
    }

    handleChange = (member, value) => {
        console.log(member.first_name, value);
    };

    handleChangeEvent = () => {
        this.setState({ event: null });
    };

    handleEventSelect = event => {
        this.setState({ event });
    };

    render() {
        const { event, members } = this.state;
        return (
            <div className="content">
                {!event && (
                    <EventSelector
                        onEventSelect={this.handleEventSelect}
                    />
                )}
                {event && (
                    <RegistrationForm
                        onRegistrationChange={this.handleChange}
                        members={members}
                        event={event}
                        onChangeEvent={this.handleChangeEvent}
                    />
                )}
            </div>
        );
    }
}

export default withFirebase(RegistrationPage);
