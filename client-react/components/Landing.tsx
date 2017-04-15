import * as React from "react";
import { Link } from 'react-router-dom';
let style = require('../styles/landing.styl');

export class Landing extends React.Component<any, any> {
    render() {
        return <div className={style.landing}>
            <h1> Hello World!</h1>
            <Link to="/login">Login</Link>
        </div>;
    }
}
