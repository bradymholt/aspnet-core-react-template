import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Login, Register, ConfirmEmail } from './Auth';
import { Landing } from './Landing';
import { Header } from './Header';
import auth from '../services/authentication';

export default class Routes extends React.Component<any, any> {
    render() {
        return <div>
            <Route exact path='/' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/confirm' component={ConfirmEmail} />
            <DefaultLayout path='/landing' component={Landing} />
        </div>
    }
}

const DefaultLayout = ({ component: Component, ...rest }: { component: any, path: string }) => (
    <Route {...rest} render={props => (
        auth.isLoggedIn() ? (
            <div>
                <Header></Header>
                <div className="container">
                    <Component {...props} />
                </div>
            </div>
        ) : (
                <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
            )
    )} />
);
