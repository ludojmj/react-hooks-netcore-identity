import React, { useState, useEffect } from 'react';
import CommonForm from './CommonForm';

const StuffCreate = props => {
  const initialDatum = props.currentDatum;
  const [datum, setDatum] = useState(initialDatum);
  const [msgErr, setMsgErr] = useState("");

  useEffect(() => {
    setDatum(initialDatum);
    setMsgErr("");
  }, [initialDatum]);

  const handleChange = event => {
    const { name, value } = event.target;
    setDatum({ ...datum, [name]: value });
    setMsgErr("");
  }

  // Submit
  const createStuff = event => {
    event.preventDefault();
    if (!/\S/.test(datum.label)) {
      setMsgErr("The label cannot be empty.");
      return;
    }

    props.onSubmit(datum);
  };

  return (
    <div className="w60 center">
      <CommonForm
        isOpen={props.isOpen}
        title="Creating a new stuff"
        msgErr={msgErr}
        datum={datum}
        handleChange={handleChange}
        closeModal={props.closeModal}
        disabled=""
        onSubmit={createStuff} />
    </div>
  );
}

export default StuffCreate;
