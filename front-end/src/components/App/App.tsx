import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import './App.scss';
import TermRoute from "../routes/TermRoute";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/package/:term?" component={TermRoute} />
          <Route component={TermRoute} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
