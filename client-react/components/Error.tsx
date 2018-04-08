import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';

export class ErrorPage extends React.Component<RouteComponentProps<any>, any> {

    getErrorCode() {
        return this.props.match.params.code;
    }

    getErrorMessage() {
        let message = null;
        switch (this.props.match.params.code) {
            case 'email-confirm':
                message = 'The email confirmation link you used is invalid or expired.'
                break;
            default:
                message = 'An unknown error has occured.'
        }

        return message;
    }

    render() {
        let code = this.getErrorCode();
        return <div>
            <Header as='h1'>Error</Header>
            <Segment attached>{this.getErrorMessage()}</Segment>
            <Segment attached>
                {code &&
                    <p>Code: {code}</p>
                }
            </Segment>
        </div>;
    }
}
