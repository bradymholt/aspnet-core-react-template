import * as React from "react";
import { Link } from 'react-router-dom';
let landingStyle = require('../styles/landing.styl');

export class Landing extends React.Component<any, any> {
    render() {
        return <div className={landingStyle.content}>
            <h1>Welcome home logged in user.</h1>
        </div>;
    }
}
