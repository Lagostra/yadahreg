import React from 'react';
import { withFirebase } from '../../components/Firebase';

class EventFormBase extends React.Component {
    constructor(props) {
        super(props);

        if (props.event) {
            const event = { ...props.event };
            delete event.id;
            this.state = {
                ...event,
            };
        } else {
            this.state = {
                title: '',
                date: new Date().toISOString().split('T')[0],
                type: 'Øvelse',
            };
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.event !== this.props.event) {
            const event = { ...this.props.event };
            delete event.id;
            this.setState({ ...event });
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

    onSubmit = e => {
        e.preventDefault();

        const event = this.state;

        if (this.props.event) {
            this.props.firebase
                .event(this.props.event.id)
                .set(this.state);
            event.id = this.props.event.id;
        } else {
            const ref = this.props.firebase.events().push(this.state);
            event.id = ref.getKey();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(event);
        }
    };

    render() {
        return (
            <form className="event-form" onSubmit={this.onSubmit}>
                <h1>
                    {this.props.event
                        ? 'Rediger medlem'
                        : 'Nytt medlem'}
                </h1>
                <label htmlFor="title">Title</label>
                <input
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="type">Type</label>
                <select
                    value={this.state.type}
                    onChange={this.onChange}
                    name="type"
                >
                    <option value="Øvelse">Øvelse</option>
                    <option value="Annet">Annet</option>
                </select>

                <label htmlFor="date">Dato</label>
                <input
                    name="date"
                    value={this.state.date}
                    onChange={this.onChange}
                    type="date"
                />

                <button type="submit" className="btn">
                    Lagre
                </button>
            </form>
        );
    }
}

const EventForm = withFirebase(EventFormBase);

export default EventForm;
