import React, { useState } from 'react';
import moment from 'moment';
import Modal from '../../components/Modal';

import SemesterForm from './SemesterForm';
import Spinner from '../../components/Spinner';
import { useFirebase, useSemesters } from 'hooks';

const SemesterSelector = ({ onSemesterSelect }) => {
  const [modalActive, setModalActive] = useState(false);
  const [editSemester, setEditSemester] = useState(null);
  const [semesters] = useSemesters();

  const firebase = useFirebase();

  return (
    <div className="semester-selector">
      <Modal active={modalActive} onClose={() => setModalActive(false)}>
        <SemesterForm
          semester={editSemester}
          onSubmit={(semester) => {
            onSemesterSelect(semester);
            setModalActive(false);
          }}
        />
      </Modal>
      <div className="semester-selector__button-bar">
        <button
          className="btn"
          onClick={() => {
            setModalActive(true);
            setEditSemester(null);
          }}
        >
          Nytt semester
        </button>
      </div>
      {!semesters && <Spinner />}
      {!!semesters && <SemesterList semesters={semesters} onSemesterSelect={onSemesterSelect} />}
    </div>
  );
};

const SemesterList = ({ semesters, onSemesterSelect }) => {
  return (
    <table className="table-full-width table-hor-lines-between table-last-td-right">
      <thead>
        <tr>
          <th>Tittel</th>
          <th className="desktop-only">Startdato</th>
          <th className="desktop-only">Sluttdato</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {semesters.map((semester) => (
          <SemesterListElement semester={semester} key={semester.id} onSemesterSelect={onSemesterSelect} />
        ))}
      </tbody>
    </table>
  );
};

const SemesterListElement = ({ semester, onSemesterSelect }) => {
  return (
    <tr>
      <td>{semester.title}</td>
      <td className="desktop-only">{moment(semester.start_date).format('DD.MM.YYYY')}</td>
      <td className="desktop-only">{moment(semester.end_date).format('DD.MM.YYYY')}</td>
      <td>
        <button onClick={() => onSemesterSelect(semester)} className="btn btn-small">
          Velg
        </button>
      </td>
    </tr>
  );
};

export default SemesterSelector;
