import * as React from "react";
let style = require('../styles/Landing.styl');

export interface HelloProps { compiler: string, framework: string; }

export class Landing extends React.Component<HelloProps, {}> {
    render() {
        return <h1 className={ style.bigWhite }> Hello World!</h1>;
    }
}
