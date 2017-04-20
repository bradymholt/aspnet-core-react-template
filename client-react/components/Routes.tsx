import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import { SignIn, Register } from './Auth';
import { ErrorPage } from './Error';
import { Landing } from './Landing';
import { Header } from './Header';
import AuthService from '../services/Auth';

export default class Routes extends React.Component<any, any> {
    render() {
        return <div>
            <DefaultLayout exact path='/' component={Landing} />
            <Route path='/sign-in' component={SignIn} />
            <Route path='/register' component={Register} />
            <Route path='/error/:code?' component={ErrorPage} />
        </div>
    }
}

const DefaultLayout = ({ component: Component, ...rest }: { component: any, path: string, exact?: boolean }) => (
    <Route {...rest} render={props => (
        AuthService.isSignedInIn() ? (
            <div>
                <Header></Header>
                <div className="container">
                    <Component {...props} />
                </div>
            </div>
        ) : (
                <Redirect to={{
                    pathname: '/sign-in',
                    state: { from: props.location }
                }} />
            )
    )} />
);
