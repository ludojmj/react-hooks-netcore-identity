import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = (props) => (
  <div className="alert--danger grid">
    <span>{props.msg ? props.msg : "Page not found."}</span>
    <NavLink className="right" to="/">
      <span className="btn--info">Reset</span>
    </NavLink>
  </div>
);

export default Error;
