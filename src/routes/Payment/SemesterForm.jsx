import React, { useEffect, useState } from 'react';
import { useFirebase } from 'hooks';

const SemesterForm = ({ semester: semesterProp, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const firebase = useFirebase();

  useEffect(() => {
    if (semesterProp) {
      setTitle(semesterProp.title);
      setStartDate(semesterProp.startDate);
      setEndDate(semesterProp.endDate);
    } else {
      setTitle('');
      setStartDate('');
      setEndDate('');
    }
  }, [semesterProp]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const semester = {
      title,
      start_date: startDate,
      end_date: endDate,
    };

    if (semesterProp) {
      firebase.semester(semesterProp.id).set(semester);
      semester.id = semesterProp.id;
    } else {
      const ref = firebase.semesters().push(semester);
      semester.id = ref.getKey();
    }

    if (onSubmit) {
      onSubmit(semester);
    }
  };

  return (
    <form className="semester-form" onSubmit={handleSubmit}>
      <h1>{semesterProp ? 'Rediger semester' : 'Nytt semester'}</h1>

      <label htmlFor="title">Tittel</label>
      <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" />

      <label htmlFor="start_date">Startdato</label>
      <input name="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />

      <label htmlFor="end_date">Sluttdato</label>
      <input name="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />

      <button type="submit" className="btn">
        Lagre
      </button>
    </form>
  );
};

export default SemesterForm;
