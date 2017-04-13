import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/bootstrap-overrides.css';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Home } from './components/Home';
import Auth from "./services/auth";

const PrivateRoute = ({ component: Component, ...rest }: { component: any, path: string }) => (
    <Route {...rest} render={props => (
        Auth.isLoggedIn() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)

ReactDOM.render(
    <Router>
        <div>
            <Route exact path='/' component={Landing} />
            <Route path='/login' component={Login} />
            <PrivateRoute path='/home' component={Home} />
        </div>
    </Router>,
    document.getElementById("app")
);


// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
