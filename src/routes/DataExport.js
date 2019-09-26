import React from 'react';
import { withFirebase } from '../components/Firebase';
import XLSX from 'xlsx';
import moment from 'moment';

const DataExportBase = ({ firebase }) => {
    const fileTypes = ['xlsx', 'csv'];
    const fileType = 'xlsx';

    const exportAllAsExcel = () => {
        let members = null;
        let events = null;
        let semesters = null;
        const memberPromise = firebase.members().once('value').then(snapshot => {
            const membersObject = snapshot.val();
            members = Object.keys(membersObject)
                .map(key => ({
                    ...membersObject[key],
                    uid: key,
                }))
                .sort((a, b) => {
                    const a1 = (
                        a.last_name
                    ).toLowerCase();
                    const b1 = (
                        b.last_name
                    ).toLowerCase();
                    if (a1 < b1) return -1;
                    if (b1 < a1) return 1;
                    return 0;
                });
        });

        const eventPromise = firebase.events().once('value').then(snapshot => {
            const eventsObject = snapshot.val();
            events = Object.keys(eventsObject).map(key => ({
                ...eventsObject[key],
                uid: key
            })).sort((a, b) => moment(a.date) - moment(b.date));
        });

        const semesterPromise = firebase.semesters().once('value').then(snapshot => {
            const semestersObject = snapshot.val()
            semesters = Object.keys(semestersObject).map(key => ({
                ...semestersObject[key],
                uid: key
            })).sort((a, b) => moment(a.end_date) - moment(b.end_date));
        });

        Promise.all([memberPromise, eventPromise, semesterPromise]).then(() => {
            const membersSheet = XLSX.utils.json_to_sheet(members,
                { header: ['uid', 'last_name', 'first_name', 'phone', 'email', 'address', 'birthday', 'gender', 'active', 'allergies', 'voice_group'] });

            const presence = members.map(member => {
                const row = {
                    last_name: member.last_name,
                    first_name: member.first_name,
                    uid: member.uid,
                };

                events.forEach(event => {
                    let status = '';
                    if (event.attendants && event.attendants[member.uid]) {
                        status = '1';
                    } else if (event.non_attendants && event.non_attendants[member.uid]) {
                        status = '0';
                    }
                    row[`${moment(event.date).format('DD.MM.YYYY')} - ${event.title}`] = status;
                });

                return row;
            });

            const presenceSheet = XLSX.utils.json_to_sheet(presence, { header: ['uid', 'last_name', 'first_name'].concat(events.map(event => `${moment(event.date).format('DD.MM.YYYY')} - ${event.title}`)) });

            const saveEvents = events.map(event => {
                let e = { ...event };
                delete e['attendants'];
                delete e['non_attendants'];

                return e;
            });

            const eventsSheet = XLSX.utils.json_to_sheet(saveEvents, { header: ['uid', 'date', 'title', 'type'] });

            const payment = members.map(member => {
                const row = {
                    last_name: member.last_name,
                    first_name: member.first_name,
                    uid: member.uid,
                };

                semesters.forEach(semester => {
                    row[semester.title] = semester.payees && semester.payees[member.uid] ? '1' : '';
                });

                return row;
            })

            const paymentSheet = XLSX.utils.json_to_sheet(payment, { header: ['uid', 'last_name', 'first_name'].concat(semesters.map(semester => semester.title)) });

            const saveSemesters = semesters.map(semester => {
                let s = { ...semester };
                delete s['payees'];

                return s;
            });
            const semestersSheet = XLSX.utils.json_to_sheet(saveSemesters, { header: ['uid', 'title', 'start_date', 'end_date'] });

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, membersSheet, 'Medlemmer');
            XLSX.utils.book_append_sheet(wb, presenceSheet, 'Oppmøte');
            XLSX.utils.book_append_sheet(wb, paymentSheet, 'Betaling');
            XLSX.utils.book_append_sheet(wb, eventsSheet, 'Arrangementer');
            XLSX.utils.book_append_sheet(wb, semestersSheet, 'Semestere');
            XLSX.writeFile(wb, 'yadahreg-data.xlsx', { bookType: 'xlsx' });
        });
    }

    return (<div className="content">
        <button className="btn" onClick={exportAllAsExcel}>
            Eksporter alt som Excel
        </button>
    </div>);
}

const DataExport = withFirebase(DataExportBase);

export default DataExport;