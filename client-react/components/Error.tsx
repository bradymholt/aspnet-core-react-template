import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

export class ErrorPage extends React.Component<RouteComponentProps<any>, any> {

    get getErrorCode() {
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
        return <div>
            <h1>Error</h1>
            <p>{this.getErrorMessage()}</p>
            {this.getErrorCode() &&
                <p>Code: {this.getErrorCode()}</p>
            }

        </div>;
    }
}
