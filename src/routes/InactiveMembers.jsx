import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { MemberForm } from './Members';
import * as PERMISSIONS from '../constants/permissions';
import { withAuthorization } from '../components/Session';
import { useEvents, useFirebase, useMembers, useSemesters } from 'hooks';

const InactiveMembers = () => {  
  const [semesters] = useSemesters();
  const [members] = useMembers();
  const [events] = useEvents();

  const firebase = useFirebase();

  const [modalActive, setModalActive] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [semester, setSemester] = useState(null);

  const getFilteredEvents = () => {
    if (!events) return null;
    let filteredEvents = events.filter(event => event.type && event.type === 'Øvelse');
    const lastThree = filteredEvents.slice(0, 3);
    const thisYear = moment().year();
    const semesterStart =
        moment() <= moment([thisYear, 6, 31])
            ? moment([thisYear, 0, 1])
            : moment([thisYear, 7, 1]);
    filteredEvents = filteredEvents.filter(
        event => moment(event.date) > semesterStart,
    );
    filteredEvents = filteredEvents.length >= 3 ? filteredEvents : lastThree;
    return filteredEvents;
  }

  const filteredEvents = getFilteredEvents();

  const inactiveMembers = members
    ?.map((member) => {
      let totalAbsent = 0;
      let absentFromLast = true;
      let absentInRow = 0;
      let maxAbsentInRow = 0;
      let lastPresent = null;
      if (events) {
        filteredEvents.forEach((event) => {
          if (!event.attendants || !event.attendants[member.id]) {
            totalAbsent += 1;

            if (!event.non_attendants || !event.non_attendants[member.id]) {
              if (absentFromLast) {
                absentInRow += 1;
                if (absentInRow > maxAbsentInRow) {
                  maxAbsentInRow = absentInRow;
                }
              } else {
                absentFromLast = true;
              }
            }
          } else {
            absentFromLast = false;
            absentInRow = 0;
            if (!lastPresent) {
              lastPresent = event.date;
            }
          }
        })
      }
      
      const inactive = maxAbsentInRow >= 3 || totalAbsent >= 6;
      
      return {
        ...member,
        inactive,
        lastPresent,
        absentInRow: maxAbsentInRow,
        totalAbsent,
      };
    })
    .filter((m) => m.inactive)
    .sort((a, b) => b.totalAbsent - a.totalAbsent)
    .sort((a, b) => b.absentInRow - a.absentInRow)
    .sort((a, b) => {
      if (!b.lastPresent && !a.lastPresent) {
        return 0;
      }
      if (!b.lastPresent) {
        return 1;
      }
      if (!a.lastPresent) {
        return -1;
      }
      return moment(a.lastPresent) - moment(b.lastPresent);
    });

  const handleModalClose = (memberId) => {
    if (memberId) {
      firebase
        .member(memberId)
        .once('value')
        .then((snapshot) => {
          setModalActive(false);
        });
    } else {
      setModalActive(false);
    }
  };

  useEffect(() => {
    if (semesters) {
      setSemester(semesters[semesters.length - 1]);
    }
  }, [semesters]);

  const loaded = !!events && !!members;

  return (
    <>
      <Modal active={modalActive} onClose={handleModalClose}>
        <MemberForm member={editMember} onSubmit={handleModalClose} />
      </Modal>
      <div className="content">
        <h1>Inaktive medlemmer</h1>
        {!loaded && <Spinner />}
        {loaded && 'Medlemskapet til de følgende kormedlemmene er regnet som avsluttet jf. korets vedtekter (§3.5).'}
        {loaded && !!inactiveMembers.length && (
          <table className="table-full-width table-hor-lines-between">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Siste øvelse</th>
                <th className="desktop-only">Fravær dette semester</th>
                <th className="desktop-only">Fravær på rad</th>
                {semester && <th className="desktop-only">Betalt semesteravgift</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inactiveMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.first_name} {member.last_name}
                  </td>
                  <td>
                    {member.lastPresent ? moment(member.lastPresent).format('DD.MM.YYYY') : 'Ingen dette semesteret'}
                  </td>
                  <td className="desktop-only">{member.totalAbsent}</td>
                  <td className="desktop-only">{member.absentInRow}</td>
                  {semester && (
                    <td className="desktop-only">{semester.payees && semester.payees[member.id] ? 'Ja' : 'Nei'}</td>
                  )}
                  <td>
                    <button className="btn btn-small" onClick={() => {setEditMember(member); setModalActive(true);}}>
                      <i className="fas fa-edit" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const authCondition = (authUser) =>
  !!authUser && !!authUser.permissions[PERMISSIONS.MEMBERS_READ] && !!authUser.permissions[PERMISSIONS.EVENTS_READ];

export default withAuthorization(authCondition)(InactiveMembers);
