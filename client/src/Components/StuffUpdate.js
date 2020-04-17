import React, { useState, useEffect } from 'react';
import CommonForm from './CommonForm';

const StuffUpdate = props => {
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
  const updateStuff = event => {
    event.preventDefault();
    if (!/\S/.test(datum.label)) {
      setMsgErr("The label cannot be empty.");
      return;
    }

    if (JSON.stringify(initialDatum) === JSON.stringify(datum)) {
      setMsgErr("No significant changes...");
      return;
    }

    props.onSubmit(datum.id, datum);
  };

  return (
    <div className="w60 center">
      <CommonForm
        isOpen={props.isOpen}
        title="Updating a stuff"
        msgErr={msgErr}
        datum={datum}
        handleChange={handleChange}
        closeModal={props.closeModal}
        disabled=""
        onSubmit={updateStuff} />
    </div>
  );
}

export default StuffUpdate;
