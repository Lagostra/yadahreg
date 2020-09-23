import React from 'react';

import { withFirebase } from '../components/Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../components/Session';
import copyTextToClipboard from '../util/copyTextToClipboard';
import Spinner from '../components/Spinner';
import * as PERMISSIONS from '../constants/permissions';
import moment from 'moment';

class MailingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      useDates: false,
      endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
      startDate: moment().subtract(6, 'd').format('YYYY-MM-DD'),
    };
  }

  componentDidMount() {
    this.props.firebase
      .members()
      .once('value')
      .then((snapshot) => {
        const membersObject = snapshot.val();

        const members = Object.keys(membersObject)
          .map((key) => ({
            ...membersObject[key],
            id: key,
          }))
          .filter((member) => member.active);

        this.setState({ members });
      });
  }

  onChange = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  onCheckboxChange = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.checked,
    });
  };

  render() {
    const { members, useDates, startDate, endDate } = this.state;
    const chosenMembers = useDates
      ? members.filter(
          (member) =>
            moment(member['created_at']) > moment(startDate) && moment(member['created_at'] < moment(endDate)),
        )
      : members;
    const mails = chosenMembers.map((member) => member.email);
    const mailString = mails.join(';');

    console.log(startDate, endDate);

    return (
      <div className="content">
        {!members.length && <Spinner />}
        {!!members.length && (
          <React.Fragment>
            <label htmlFor="useDates">Bare send til nye medlemmer</label>
            <input type="checkbox" name="useDates" value={useDates} onClick={this.onCheckboxChange} />
            {useDates && (
              <React.Fragment>
                <label htmlFor="startDate">Startdato:</label>
                <input type="date" name="startDate" value={startDate} onChange={this.onChange} />

                <label htmlFor="endDate">Sluttdato:</label>
                <input type="date" name="endDate" value={endDate} onChange={this.onChange} />
              </React.Fragment>
            )}
            <a href={'mailto:' + mailString} className="btn">
              Send mail
            </a>
            <button className="btn" onClick={() => copyTextToClipboard(mailString)}>
              Kopier mailadresser
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_READ];

export default compose(withFirebase, withAuthorization(authCondition))(MailingList);
