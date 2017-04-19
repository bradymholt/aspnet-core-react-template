import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import authService from "../services/authentication";
let authStyle = require('../styles/auth.styl');

export class Login extends React.Component<any, any> {
    refs: {
        username: HTMLInputElement;
        password: HTMLInputElement;
    }

    state = {
        redirectToReferrer: false,
        error: null as string[]
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({ errors: null });
        authService.login(this.refs.username.value, this.refs.password.value).then(response => {
            if (!response.error) {
                this.setState({ redirectToReferrer: true })
            } else {
                this.setState({ error: response.error.errorDescription });
            }
        });
    }

    render() {
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to="/landing" />
            );
        }

        return <div className={authStyle.auth}>
            <form className={authStyle.formAuth} onSubmit={(e) => this.handleSubmit(e)}>
                <h2 className={authStyle.formAuthHeading}>Please sign in</h2>
                {this.state.error &&
                    <div className="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                }
                <label htmlFor="inputEmail" className="form-control-label sr-only">Email address</label>
                <input type="email" id="inputEmail" ref="username" defaultValue="user@test.com" className="form-control form-control-danger" placeholder="Email address" required />
                <label htmlFor="inputPassword" className="form-control-label sr-only">Password</label>
                <input type="password" id="inputPassword" ref="password" defaultValue="P2ssw0rd!" className="form-control" placeholder="Password" required />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
            <div className={authStyle.authEtc}>
                <Link to="/register">Register</Link>
            </div>
        </div>;
    }
}

export class Register extends React.Component<any, any> {
    refs: {
        email: HTMLInputElement;
        password: HTMLInputElement;
    }

    state = {
        registerComplete: false,
        errors: {} as { [key: string]: string }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({ errors: { } });
        authService.register(this.refs.email.value, this.refs.password.value).then(response => {
            if (!response.error) {
                this.setState({ registerComplete: true })
            } else {
                this.setState({ errors: response.error });
            }
        });
    }

    _formGroupClass(field: string) {
        var className = "form-group ";
        if (field) {
            className += " has-danger"
        }
        return className;
    }

    render() {
        if (this.state.registerComplete) {
            return <RegisterComplete />
        } else {
            return <div className={authStyle.auth}>
                <form className={authStyle.formAuth} onSubmit={(e) => this.handleSubmit(e)}>
                    <h2 className={authStyle.formAuthHeading}>Please register for access</h2>
                    {this.state.errors.all &&
                        <div className="alert alert-danger" role="alert">
                        {this.state.errors.all}
                        </div>
                    }
                    <div className={this._formGroupClass(this.state.errors.username)}>
                        <label htmlFor="inputEmail">Email address</label>
                        <input type="email" id="inputEmail" ref="email" defaultValue="user@test.com" className="form-control" placeholder="Email address" required />
                        <div className="form-control-feedback">{this.state.errors.username}</div>
                    </div>
                    <div className={this._formGroupClass(this.state.errors.password)}>
                        <label htmlFor="inputPassword">Password</label>
                        <input type="password" id="inputPassword" ref="password" defaultValue="P2ssw0rd!" className="form-control" placeholder="Password" required />
                        <div className="form-control-feedback">{this.state.errors.password}</div>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
                </form>
            </div>;
        };
    }
}

export class RegisterComplete extends React.Component<any, any> {
    render() {
        return <div className={authStyle.auth}>
            Thank you for registering!
            <Link to="/">Login</Link>
        </div>;
    }
}

export class ConfirmEmail extends React.Component<any, any> {
    refs: {
        token: HTMLInputElement;
    }

    state = {
        redirectToLogin: false
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        authService.confirm(this.refs.token.value).then(isSuccessful => {
            if (isSuccessful) {
                this.setState({ redirectToLogin: true })
            } else {

            }
        });
    }

    render() {
        const { redirectToLogin } = this.state;

        if (redirectToLogin) {
            return (
                <Redirect to="/login" />
            );
        }

        return <div className={authStyle.auth}>
            <form className={authStyle.formAuth} onSubmit={(e) => this.handleSubmit(e)}>
                <h2 className={authStyle.formAuthHeading}>Please confirm registration</h2>
                <label htmlFor="inputToken" className="sr-only">Token</label>
                <input id="inputToken" ref="token" className="form-control" placeholder="Token" required />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Confirm</button>
            </form>
        </div>;
    }
}
