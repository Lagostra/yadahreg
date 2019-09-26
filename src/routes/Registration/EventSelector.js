import React from 'react';
import moment from 'moment';

import Modal from './../../components/Modal';
import EventForm from './EventForm';
import { withFirebase } from '../../components/Firebase';
import Spinner from '../../components/Spinner';

class EventSelectorBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            editEvent: null,
            events: [],
        };
    }

    componentDidMount() {
        this.props.firebase.events().on('value', snapshot => {
            const eventsObject = snapshot.val();
            let events = Object.keys(eventsObject).map(key => ({
                ...eventsObject[key],
                id: key,
            }));

            events.sort((a, b) => moment(b.date) - moment(a.date));

            this.setState({ events });
        });
    }

    componentWillUnmount() {
        this.props.firebase.events().off();
    }

    createNewRehearsal = () => {
        const event = {
            title: 'Korøvelse',
            type: 'Øvelse',
            date: new Date().toISOString().split('T')[0],
        };

        const newRef = this.props.firebase.events().push(event);
        event.id = newRef.getKey();

        this.props.onEventSelect(event);
    };

    render() {
        const { events, editEvent, modalActive } = this.state;

        return (
            <div className="event-selector">
                <Modal
                    active={modalActive}
                    onClose={() =>
                        this.setState({ modalActive: false })
                    }
                >
                    <EventForm
                        event={editEvent}
                        onSubmit={event => {
                            this.props.onEventSelect(event);
                            this.setState({ modalActive: false });
                        }}
                    />
                </Modal>
                <div className="event-selector__button-bar">
                    <button
                        className="btn"
                        onClick={this.createNewRehearsal}
                    >
                        Ny øvelse i dag
                    </button>
                    <button
                        className="btn"
                        onClick={() =>
                            this.setState({
                                modalActive: true,
                                editEvent: null,
                            })
                        }
                    >
                        Nytt arrangement
                    </button>
                </div>
                {!events.length && <Spinner />}
                {!!events.length && (
                    <EventList
                        events={events}
                        onEventSelect={this.props.onEventSelect}
                    />
                )}
            </div>
        );
    }
}

const EventSelector = withFirebase(EventSelectorBase);

const EventList = ({ events, onEventSelect }) => {
    return (
        <table className="table-full-width table-hor-lines-between">
            <tbody>
                {events.map(event => (
                    <EventListElement
                        event={event}
                        key={event.id}
                        onEventSelect={onEventSelect}
                    />
                ))}
            </tbody>
        </table>
    );
};

const EventListElement = ({ event, onEventSelect }) => {
    return (
        <tr>
            <td>
                {moment(event.date).format('DD.MM.YYYY')} -{' '}
                {event.title}
            </td>
            <td>
                <button
                    onClick={() => onEventSelect(event)}
                    className="btn btn-small"
                >
                    Velg
                </button>
            </td>
        </tr>
    );
};

export default EventSelector;
