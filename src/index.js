import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import './index.css';
import App from './App';
import Moderator from "./Moderator";
import * as serviceWorker from './serviceWorker';

let routes = (
    <BrowserRouter>
        <Switch>
            <Route path="/moderator">
                <Moderator></Moderator>
            </Route>
            <Route path="/">
                <App></App>
            </Route>
        </Switch>
    </BrowserRouter>
);
ReactDOM.render(routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
