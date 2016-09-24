import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, Link, browserHistory } from "react-router";
import { Landing } from "./components/Landing";

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Landing}>
        </Route>
    </Router>,
    document.getElementById("app")
);

