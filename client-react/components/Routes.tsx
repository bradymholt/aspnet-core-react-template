import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { SignIn, Register } from './Auth';
import { ErrorPage } from './Error';
import { Contacts } from './Contacts';
import { Header } from './Header';
import AuthService from '../services/Auth';

export class RoutePaths {
    public static Contacts: string = "/contacts";
    public static ContactEdit: string = "/contacts/edit/:id";
    public static ContactNew: string = "/contacts/new";
    public static SignIn: string = "/";
    public static Register: string = "/register/";
}

export default class Routes extends React.Component<any, any> {
    render() {
        return <Switch>
            <Route exact path={RoutePaths.SignIn} component={SignIn} />
            <Route path={RoutePaths.Register} component={Register} />
            <DefaultLayout path={RoutePaths.Contacts} component={Contacts} />
            <Route path='/error/:code?' component={ErrorPage} />
        </Switch>
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
                    pathname: RoutePaths.SignIn,
                    state: { from: props.location }
                }} />
            )
    )} />
);
