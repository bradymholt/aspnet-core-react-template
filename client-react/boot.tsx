import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Landing } from "./components/Landing";

ReactDOM.render(
    <Router>
        <Route path="/" component={Landing} />
    </Router>,
    document.getElementById("app")
);

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
