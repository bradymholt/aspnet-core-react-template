import * as React from "react";
import { Link } from 'react-router-dom';

export class Home extends React.Component<any, any> {
    render() {
        return <div className="container">
            <div className="starter-template">
            <h1>Welcome home logged in user.</h1>
            </div>
        </div>;
    }
}
