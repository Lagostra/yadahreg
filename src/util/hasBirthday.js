import moment from 'moment';

const hasBirthday = (member) => {
  let birthday = moment(member.birthday);
  let today = moment();
  return birthday.date() === today.date() && birthday.month() === today.month();
};

export default hasBirthday;
