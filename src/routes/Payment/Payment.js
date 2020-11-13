import React from 'react';
import { withFirebase } from './../../components/Firebase';
import SemesterSelector from './SemesterSelector';
import PaymentForm from './PaymentForm';
import { compose } from 'recompose';
import * as PERMISSIONS from '../../constants/permissions';
import { withAuthorization } from '../../components/Session';

class PaymentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            semester: null,
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
                .filter(member => member.active)
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

    handlePaymentChange = (member, value) => {
        const { firebase } = this.props;
        const { semester } = this.state;

        if (!semester['payees']) {
            semester.payees = {};
        }

        if (value === 'paid') {
            semester.payees[member.id] = member.id;
        } else if (value === 'not-paid') {
            delete semester.payees[member.id];
        }

        const saveSemester = { ...semester };
        delete saveSemester['id'];

        this.setState({ semester });
        firebase.semester(semester.id).set(saveSemester);
    };

    handleChangeSemester = () => {
        this.setState({ semester: null });
    };

    handleSemesterSelect = semester => {
        if (this.state.semester) {
            this.props.firebase
                .semester(this.state.semester.id)
                .off();
        }

        this.props.firebase
            .semester(semester.id)
            .on('value', snapshot => {
                this.setState({
                    semester: { ...snapshot.val(), id: semester.id },
                });
            });
    };

    render() {
        const { semester, members } = this.state;
        return (
            <div className="content">
                {!semester && (
                    <SemesterSelector
                        onSemesterSelect={this.handleSemesterSelect}
                    />
                )}
                {semester && (
                    <PaymentForm
                        onPaymentChange={this.handlePaymentChange}
                        members={members}
                        semester={semester}
                        onChangeSemester={this.handleChangeSemester}
                    />
                )}
            </div>
        );
    }
}

const authCondition = authUser =>
    !!authUser && !!authUser.permissions[PERMISSIONS.SEMESTERS_WRITE];

export default compose(
    withFirebase,
    withAuthorization(authCondition),
)(PaymentPage);
