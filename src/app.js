import 'babel/polyfill';

import createHashHistory from 'history/lib/createHashHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayRouter } from 'react-router-relay';
import { IndexRoute, Route } from 'react-router';

import App from './components/App';
import Loading from './components/Loading';
import Snapshot from './components/Snapshot';

import ViewerQueries from './queries/ViewerQueries';

import './styles/main.scss'; // include our stylesheet

const history = createHashHistory({ queryKey: false });

ReactDOM.render((
  <RelayRouter history={history}>
    <Route
      path="/" component={App}
      queries={ViewerQueries}
      renderLoading={() => <Loading />}
    >
      <IndexRoute
        component={Snapshot}
        queries={ViewerQueries}
        prepareParams={() => ({ buildingReference: 'ag' })}
      />
      <Route
        path=":buildingReference" component={Snapshot}
        queries={ViewerQueries}
      />
    </Route>
  </RelayRouter>
), document.getElementById('root'));
