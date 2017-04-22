import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { SignIn, Register } from './Auth';
import { ErrorPage } from './Error';
import { Landing } from './Landing';
import { Header } from './Header';
import AuthService from '../services/Auth';

const History = createBrowserHistory();
export { History };

export class RoutePaths {
    public static Landing: string = "/landing";
    public static SignIn: string = "/sign-in";
    public static Register: string = "/register";
}

export default class Routes extends React.Component<any, any> {
    render() {
        return <div>
            <DefaultLayout path={RoutePaths.Landing} component={Landing} />
            <Route path={RoutePaths.SignIn} component={SignIn} />
            <Route path={RoutePaths.Register} component={Register} />
            <Route path='/error/:code?' component={ErrorPage} />
            <Switch>
                <Redirect from='/' to={RoutePaths.Landing} />
            </Switch>
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
                    pathname: RoutePaths.SignIn,
                    state: { from: props.location }
                }} />
            )
    )} />
);
