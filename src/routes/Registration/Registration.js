import React from 'react';
import { withFirebase } from '../../components/Firebase';
import Modal from '../../components/Modal';
import EventForm from './EventForm';
import RegistrationForm from './RegistrationForm';

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            event: null,
        };

        this.presenceOptions = [
            {
                value: 'present',
                text: <i className="fas fa-check-circle" />,
            },
            {
                value: 'notified',
                text: <i className="fas fa-comment" />,
            },
            {
                value: 'not-present',
                text: <i className="fas fa-times-circle" />,
            },
        ];
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

    handleChange = (member, value) => {
        console.log(member.first_name, value);
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
                    <button
                        className="btn btn-link"
                        onClick={() => {
                            this.setState({ event: null });
                        }}
                    >
                        Endre arrangement
                    </button>
                )}
                {event && (
                    <RegistrationForm
                        onRegistrationChange={this.handleChange}
                        members={members}
                        event={event}
                    />
                )}
            </div>
        );
    }
}

const EventSelectorBase = ({ firebase, onEventSelect }) => {
    const [modalActive, setModalActive] = React.useState(false);
    const [editEvent, setEditEvent] = React.useState(null);

    const createNewRehearsal = () => {
        const event = {
            title: 'Korøvelse',
            type: 'Øvelse',
            date: new Date().toISOString().split('T')[0],
        };

        const newRef = firebase.events().push(event);
        event.id = newRef.getKey();

        onEventSelect(event);
    };

    return (
        <div className="event-selector">
            <button className="btn" onClick={createNewRehearsal}>
                Ny øvelse i dag
            </button>
            <button
                className="btn"
                onClick={() => {
                    setModalActive(true);
                    setEditEvent(null);
                }}
            >
                Nytt arrangement
            </button>
            <Modal
                active={modalActive}
                onClose={() => setModalActive(false)}
            >
                <EventForm
                    event={editEvent}
                    onSubmit={event => {
                        onEventSelect(event);
                        setModalActive(false);
                    }}
                />
            </Modal>
        </div>
    );
};

const EventSelector = withFirebase(EventSelectorBase);

export default withFirebase(RegistrationPage);
