import React from "react";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import * as ReactDOMClient from "react-dom/client"; //icons

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
);
