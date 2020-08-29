import React from 'react';
import { AuthenticationContext } from '@axa-fr/react-oidc-context';
import logo from './logo.svg';

export default () => (
  <AuthenticationContext.Consumer>
    {props => {
      return (
        <div className="w60 center">
          {props.oidcUser ? (
            <div className="autogrid has-gutter-l">
              <div>
                <h1><img src={logo} alt="logo" /> Stuff</h1>
              </div>

              <div className="txtright">
                <div>{props.oidcUser.profile.name}</div>
                <button className="btn--inverse" onClick={props.logout}>Logout</button>
              </div>
            </div>
          ) : (
              <button className="btn--primary" onClick={props.login}>Login</button>
            )}
        </div>
      );
    }}
  </AuthenticationContext.Consumer>
);
