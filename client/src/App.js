import React from 'react';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';
import { AuthenticationProvider, oidcLog, InMemoryWebStorage } from '@axa-fr/react-oidc-context';
import { withOidcSecure } from '@axa-fr/react-oidc-context';
import Home from './Components/Home';
import CrudManager from './Components/CrudManager';
import Error from './Components/Error';
import oidcConfiguration from './oidcConfiguration';
import logo from './logo.svg';
import 'knacss/css/knacss.css';
import './App.css';

const origin = document.location.origin;
const oidcConfig = origin ? oidcConfiguration.configurations.find(x => x.origin === origin) : oidcConfiguration.configurations[0];

const App = () => {
  return (
    <>
      <header className="txtcenter">
        <h1><img src={logo} alt="logo" /> Stuff</h1>
      </header>
      <AuthenticationProvider
        configuration={oidcConfig.config}
        loggerLevel={oidcLog.NONE}
        UserStore={InMemoryWebStorage}
        isEnabled={true}
      >
        <BrowserRouter>
          <Route>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/crud" component={withOidcSecure(CrudManager)} />
              <Route component={Error} />
            </Switch>
          </Route>
        </BrowserRouter>
      </AuthenticationProvider>
    </>
  );
}

export default App;
