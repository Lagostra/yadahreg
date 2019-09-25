import React from 'react';
import { withFirebase } from '../../components/Firebase';

class SemesterFormBase extends React.Component {
    constructor(props) {
        super(props);

        if (props.semester) {
            const semester = { ...props.semester };
            delete semester.id;
            this.state = { ...semester };
        } else {
            this.state = {
                title: '',
                start_date: '',
                end_date: '',
            };
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.semester !== this.props.semester) {
            const semester = { ...this.props.semester };
            delete semester.id;
            this.setState({ ...semester });
        }
    }

    onChange = event => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value,
        });
    };

    onSubmit = e => {
        e.preventDefault();

        const { title, start_date, end_date } = this.state;
        const semester = {
            title,
            start_date,
            end_date,
        };

        if (this.props.semester) {
            this.props.firebase
                .semester(this.props.semester.id)
                .set(semester);
            semester.id = this.props.semester.id;
        } else {
            const ref = this.props.firebase
                .semesters()
                .push(semester);
            semester.id = ref.getKey();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(semester);
        }
    };

    render() {
        const { title, start_date, end_date } = this.state;

        return (
            <form className="semester-form" onSubmit={this.onSubmit}>
                <h1>
                    {this.props.semester
                        ? 'Rediger semester'
                        : 'Nytt semester'}
                </h1>

                <label htmlFor="title">Tittel</label>
                <input
                    name="title"
                    value={title}
                    onChange={this.onChange}
                    type="text"
                />

                <label htmlFor="start_date">Startdato</label>
                <input
                    name="start_date"
                    value={start_date}
                    onChange={this.onChange}
                    type="date"
                />

                <label htmlFor="end_date">Sluttdato</label>
                <input
                    name="end_date"
                    value={end_date}
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

const SemesterForm = withFirebase(SemesterFormBase);

export default SemesterForm;
