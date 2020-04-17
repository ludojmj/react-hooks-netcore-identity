import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthenticationContext } from '@axa-fr/react-oidc-context';

export default () => (
  <header>
    <AuthenticationContext.Consumer>
      {props => {
        return (
          <div className="txtcenter">
            {props.oidcUser ? (
              <div className="grid-2">
                <div>
                  <button className="btn--inverse" onClick={props.logout}>Logout</button>
                </div>
                <NavLink to="/crud">
                  <span className="btn--info">Go to Website</span>
                </NavLink>
              </div>
            ) : (
                <button className="btn--primary" onClick={props.login}>Login</button>
              )}
          </div>
        );
      }}
    </AuthenticationContext.Consumer>
  </header>
);
