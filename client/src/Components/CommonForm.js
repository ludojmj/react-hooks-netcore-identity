import React from 'react';

const CommonForm = props => {
  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      // ENTER
      if (event.target.id !== "otherInfo") {
        event.preventDefault();  
        props.onSubmit(event);
      }

      return;
    }

    // ESCAPE
    if (event.keyCode === 27) {
      props.closeModal();
    }
  }

  return (
    <form onSubmit={props.onSubmit} onKeyDown={handleKeyDown} className="alert">
      <header className="clearfix">
        <button className="fr btn--danger" onClick={props.closeModal}> X </button>
        <div className="u-bold">
          <div className={props.title.indexOf("Deleting") > -1 ? "alert--danger" : "alert--primary"}>{props.title}</div>
          <div className="alert--danger">{props.msgErr}</div>
        </div>
      </header>

      <div>
        <label className="u-bold">Owner:</label>
      </div>
      <div className="tag">{props.datum.user ? props.datum.user.givenName : "Current user"}</div>

      <div>
        <label className="u-bold">Label:</label>
      </div>
      <input className="w100" autoFocus type="text" maxLength="79" name="label" id="label" placeholder="Label" value={props.datum.label} onChange={props.handleChange} disabled={props.disabled} />

      <div>
        <label className="u-bold txtright">Description:</label>
      </div>
      <input className="w100" type="text" maxLength="79" name="description" id="description" placeholder="Description" value={props.datum.description} onChange={props.handleChange} disabled={props.disabled} />

      <div>
        <label className="u-bold txtright">Other info:</label>
      </div>
      <textarea className="w100" rows="5" maxLength="399" name="otherInfo" id="otherInfo" placeholder="Other info" value={props.datum.otherInfo} onChange={props.handleChange} disabled={props.disabled} />

      <footer className="clearfix">
        <button className="fl btn--danger" onClick={props.closeModal}>Cancel</button>
        <button className="fr btn--success">Confirm</button>
      </footer>
    </form>
  );
}

export default CommonForm;
