import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

export class ErrorPage extends React.Component<RouteComponentProps<any>, any> {
    render() {
        return <div>
            <h1>Error</h1>
            <p>An error occured while processing your request.</p>
            { this.props.match.params.code &&
                <p>Code: {this.props.match.params.code}</p>
            }

        </div>;
    }
}
