import React, { useState, useEffect } from 'react';
import CommonForm from './CommonForm';

const StuffDelete = props => {
  const initialDatum = props.currentDatum;
  const [datum, setDatum] = useState(initialDatum);

  useEffect(() => {
    setDatum(initialDatum);
  }, [initialDatum]);

  // Submit
  const deleteStuff = event => {
    event.preventDefault();
    props.onSubmit(datum.id);
  };

  return (
    <div className="w60 center">
      <CommonForm
        isOpen={props.isOpen}
        title="Deleting a stuff"
        datum={datum}
        handleChange={null}
        closeModal={props.closeModal}
        disabled="disabled"
        onSubmit={deleteStuff} />
    </div>
  );
}

export default StuffDelete;
