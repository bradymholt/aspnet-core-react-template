import * as React from "react";
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { RoutePaths } from './Routes';
import AuthService from '../services/Auth';
import { Icon, Label, Message, Grid, Form, Segment, Divider, Button, Input } from 'semantic-ui-react';
let authStyle = require('../styles/auth.styl');
let authService = new AuthService();

export class SignIn extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        username: HTMLInputElement;
        password: HTMLInputElement;
    };

    state = {
        initialLoad: true,
        error: null as string
    };

    handleSubmit = () => {
        event.preventDefault();
        this.setState({ errors: null, initialLoad: false });
        authService.signIn(this.refs.username.value, this.refs.password.value).then(response => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Contacts);
            } else {
                this.setState({ error: response.error_content.error_description });
            }
        });
    }

    render() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);

        let initialLoadContent = null;
        if (this.state.initialLoad) {
            if (params.get('confirmed')) {
                initialLoadContent = <Message icon='checkmark' header='Your email address has been successfully confirmed.' success attached />
            }

            if (params.get('expired')) {
                initialLoadContent = <Message icon='info' header='Sesion Expired' content='You need to sign in again.' info attached />
            }

            if (this.props.history.location.state && this.props.history.location.state.signedOut) {
                initialLoadContent = <Message icon='info' header='Signed Out'  info attached />
            }
        }
        return <div className={authStyle.auth}>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Message
                        positive
                        attached
                        header='Login to your account'
                        content="Access all the features."
                    />
                    {initialLoadContent}
                    {this.state.error &&
                        <Message icon='warning sign' header='Something`s wrong' content={this.state.error} warning attached />
                    }
                    <Form className="segment attached" size='large' onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label htmlFor="inputEmail">E-mail</label>
                            <input
                                type="email" 
                                id="inputEmail" 
                                ref="username" 
                                placeholder="Email address"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label htmlFor="inputPassword">Password</label>
                            <input
                                placeholder='Password'
                                type='password'
                                name="inputPassword" 
                                ref="password"
                            />
                        </Form.Field>
                        <Divider hidden />
                        <Button color='teal' fluid size='large' type="submit">Login</Button>
                    </Form>
                    <Segment attached='bottom'>
                        <Link to="/register">No account? Register</Link>
                    </Segment>
                </Grid.Column>
            </Grid>            
        </div>;
    }
}

export class Register extends React.Component<any, any> {
    refs: {
        email: HTMLInputElement;
        password: HTMLInputElement;
    };

    state = {
        registerComplete: false,
        errors: {} as { [key: string]: string }
    };

    handleSubmit = () => {
        event.preventDefault();
        this.setState({ errors: {} });
        authService.register(this.refs.email.value, this.refs.password.value).then(response => {
            if (!response.is_error) {
                this.setState({ registerComplete: true })
            } else {
                this.setState({ errors: response.error_content });
            }
        });

    }

    render() {
        if (this.state.registerComplete) {
            return <RegisterComplete email={this.refs.email.value} />
        } else {
            return <div className={authStyle.auth}>
                <Grid centered columns={2}>
                    <Grid.Column>
                        <Message
                            attached
                            header='Please register for access'
                            content="Access all the features."
                        />
                        {this.state.errors.general &&
                            <Message icon='warning sign' header='Something`s wrong' content={this.state.errors.general} error attached />
                        }
                        {this.state.errors && Object.keys(this.state.errors).length !== 0 && this.state.errors.constructor === Object &&
                            <Message icon='warning sign' header='Something`s wrong' attached error role="alert" />
                        }
                        <Form className="segment attached" size='large' onSubmit={this.handleSubmit}>
                            <Form.Field required error={this.state.errors.username && true}>
                                <label htmlFor="inputEmail">E-mail</label>
                                <input
                                    type="email" 
                                    id="inputEmail" 
                                    ref="email" 
                                    placeholder="Email address"
                                />
                                {this.state.errors.username && <Label basic color='red' pointing>{this.state.errors.username}</Label>}
                            </Form.Field>
                            <Form.Field required error={this.state.errors.password && true}>
                                <label htmlFor="inputPassword">Password</label>
                                <input
                                    id="inputPassword"
                                    placeholder='Password'
                                    type='password'
                                    name="inputPassword" 
                                    ref="password"
                                />
                                {this.state.errors.password && <Label basic color='red' pointing>{this.state.errors.password}</Label>}
                            </Form.Field>
                            <Divider hidden />
                            <Button color='teal' fluid size='large' type="submit">Sign up</Button>
                        </Form>
                        <Segment attached='bottom'>
                            <Link to="/">Already have account? Login</Link>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>;
        };
    }
}

interface RegisterCompleteProps {
    email: string;
}

export class RegisterComplete extends React.Component<RegisterCompleteProps, any> {
    render() {
        return <div className={authStyle.auth}>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Message
                        positive
                        icon='checkmark'
                        attached
                        header='Success!'
                        content="Your account has been created."
                    />
                    <Segment attached>
                        <p>
                            A confirmation email has been sent to {this.props.email}. You will need to follow the provided link to confirm your email address before signing in.
                        </p>
                    </Segment>
                    <Segment attached='bottom'>
                        <Link role="button" to="/">Sign in</Link>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>;
    }
}
