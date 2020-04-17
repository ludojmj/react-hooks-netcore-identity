import React, { useState, useEffect } from 'react';
import CommonForm from './CommonForm';

const StuffRead = props => {
  const initialDatum = props.currentDatum;
  const [datum, setDatum] = useState(initialDatum);

  useEffect(() => {
    setDatum(initialDatum);
  }, [initialDatum]);

  return (
    <div className="w60 center">
      <CommonForm
        isOpen={props.isOpen}
        title="Reading a stuff"
        datum={datum}
        handleChange={null}
        closeModal={props.closeModal}
        disabled="disabled"
        onSubmit={props.onSubmit} />
    </div>
  );
}

export default StuffRead;
