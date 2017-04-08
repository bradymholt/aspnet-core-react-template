import * as React from "react";
let style = require('../styles/Landing.styl');

export class Landing extends React.Component<any,any> {
    render() {
        return <h1 className={ style.bigWhite }> Hello! World!</h1>;
    }
}
