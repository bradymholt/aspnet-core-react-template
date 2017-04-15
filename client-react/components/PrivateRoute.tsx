import * as React from "react";
import { Link, Redirect, Route } from 'react-router-dom';
import auth from "../services/authentication";

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

export default PrivateRoute
