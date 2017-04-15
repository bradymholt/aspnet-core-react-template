import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect } from 'react-router-dom';
import { Landing } from './Landing';
import { Login } from './Login';
import { Home } from './Home';
import { Header } from './Header';
import auth from '../services/authentication';

export default class Routes extends React.Component<any, any> {
    render() {
        return <div>
            <Route exact path='/' component={Landing} />
            <Route path='/login' component={Login} />
            <PrivateRoute path="*" component={Header} />
            <PrivateRoute path='/home' component={Home} />
        </div>
    }
}

const PrivateRoute = ({ component: Component, ...rest }: { component: any, path: string }) => (
    <Route {...rest} render={props => (
        auth.isLoggedIn() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)
