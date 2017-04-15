import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import auth from "../services/authentication";

export class Login extends React.Component<any, any> {
    refs: {
        username: HTMLInputElement;
        password: HTMLInputElement;
    }

    state = {
        redirectToReferrer: false
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        auth.login(this.refs.username.value, this.refs.password.value).then(isLoggedIn => {
            if (isLoggedIn) {
                this.setState({ redirectToReferrer: true })
            } else {

            }
        });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to="/home" />
            );
        }

        return <div className="login">
            <form ref="loginForm" className="form-signin" onSubmit={(e) => this.handleSubmit(e)}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" ref="username" defaultValue="user@test.com" className="form-control" placeholder="Email address" required />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" ref="password" defaultValue="P2ssw0rd!" className="form-control" placeholder="Password" required />
                <div className="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        </div>;
    }
}
