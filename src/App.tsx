import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  BrowserRouterProps,
} from 'react-router-dom';
import AddGroupMembers from './features/group/AddGroupMembers';
import Groups from './features/group/Groups';
import SelectedPerson from './features/group/SelectedPerson';

const App = (props: BrowserRouterProps) => {
  return (
    <Router {...props}>
      <Switch>
        <Route exact path='/'>
          <AddGroupMembers />
        </Route>
        <Route path='/getSecretSanta'>
          <SelectedPerson />
        </Route>
        <Route path='/groups'>
          <Groups />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
