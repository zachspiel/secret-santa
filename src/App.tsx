import React from "react";
import { BrowserRouterProps, Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import Groups from "./features/group/Groups";
import SelectedPerson from "./features/secretSanta/SecretSanta";
import SecretSantaMessage from "./features/secretSanta/SecretSantaMessage";

const App = (props: BrowserRouterProps): JSX.Element => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getSecretSanta" element={<SelectedPerson />} />
            <Route path="/secretSantaMessage" element={<SecretSantaMessage />} />
            <Route path="/groups" element={<Groups />} />
        </Routes>
    );
};

export default App;
