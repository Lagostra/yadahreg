import React from 'react';
import moment from 'moment';
import Modal from './../../components/Modal';

import { withFirebase } from '../../components/Firebase';
import SemesterForm from './SemesterForm';

class SemesterSelectorBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            editSemester: null,
            semesters: [],
        };
    }

    componentDidMount() {
        this.props.firebase.semesters().on('value', snapshot => {
            const semestersObject = snapshot.val();
            if (!semestersObject) {
                return;
            }

            let semesters = Object.keys(semestersObject).map(key => ({
                ...semestersObject[key],
                id: key,
            }));

            semesters.sort(
                (a, b) => moment(b.start_date) - moment(a.end_date),
            );

            this.setState({ semesters });
        });
    }

    componentWillUnmount() {
        this.props.firebase.semesters().off();
    }

    render() {
        const { semesters, editSemester, modalActive } = this.state;

        return (
            <div className="semester-selector">
                <Modal
                    active={modalActive}
                    onClose={() =>
                        this.setState({ modalActive: false })
                    }
                >
                    <SemesterForm
                        semester={editSemester}
                        onSubmit={semester => {
                            this.props.onSemesterSelect(semester);
                            this.setState({ modalActive: false });
                        }}
                    />
                </Modal>
                <div className="semester-selector__button-bar">
                    <button
                        className="btn"
                        onClick={() =>
                            this.setState({
                                modalActive: true,
                                editSemester: null,
                            })
                        }
                    >
                        Nytt semester
                    </button>
                </div>
                <SemesterList
                    semesters={semesters}
                    onSemesterSelect={this.props.onSemesterSelect}
                />
            </div>
        );
    }
}

const SemesterSelector = withFirebase(SemesterSelectorBase);

const SemesterList = ({ semesters, onSemesterSelect }) => {
    return (
        <table className="table-full-width table-hor-lines-between">
            <thead>
                <tr>
                    <th>Tittel</th>
                    <th className="desktop-only">Startdato</th>
                    <th className="desktop-only">Sluttdato</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {semesters.map(semester => (
                    <SemesterListElement
                        semester={semester}
                        key={semester.id}
                        onSemesterSelect={onSemesterSelect}
                    />
                ))}
            </tbody>
        </table>
    );
};

const SemesterListElement = ({ semester, onSemesterSelect }) => {
    return (
        <tr>
            <td>{semester.title}</td>
            <td className="desktop-only">
                {moment(semester.start_date).format('DD.MM.YYYY')}
            </td>
            <td className="desktop-only">{moment(semester.end_date).format('DD.MM.YYYY')}</td>
            <td>
                <button
                    onClick={() => onSemesterSelect(semester)}
                    className="btn btn-small"
                >
                    Velg
                </button>
            </td>
        </tr>
    );
};

export default SemesterSelector;
