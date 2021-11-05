import React from "react";
import {
    Route,
    BrowserRouter as Router,
    Switch,
    BrowserRouterProps,
} from "react-router-dom";
import Home from "./features/home/Home";
import Groups from "./features/group/Groups";
import SelectedPerson from "./features/secretSanta/SecretSanta";

const App = (props: BrowserRouterProps): JSX.Element => {
    return (
        <Router {...props}>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/getSecretSanta">
                    <SelectedPerson />
                </Route>
                <Route path="/groups">
                    <Groups />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
