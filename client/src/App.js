import React from 'react';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';
import { AuthenticationProvider, oidcLog, InMemoryWebStorage } from '@axa-fr/react-oidc-context';
import { withOidcSecure } from '@axa-fr/react-oidc-context';
import CrudManager from './Components/CrudManager';
import Error from './Components/Error';
import oidcConfiguration from './oidcConfiguration';
import 'knacss/css/knacss.css';
import './App.css';

const origin = document.location.origin;
const oidcConfig = origin ? oidcConfiguration.configurations.find(x => x.origin === origin) : oidcConfiguration.configurations[0];

const App = () => {
  return (
      <AuthenticationProvider
        configuration={oidcConfig.config}
        loggerLevel={oidcLog.NONE}
        UserStore={InMemoryWebStorage}
        isEnabled={true}
      >
        <BrowserRouter>
          <Route>
            <Switch>
              <Route path="/" component={withOidcSecure(CrudManager)} />
              <Route component={Error} />
            </Switch>
          </Route>
        </BrowserRouter>
      </AuthenticationProvider>
  );
}

export default App;
