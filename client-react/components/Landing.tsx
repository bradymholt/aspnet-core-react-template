import * as React from "react";
import { Link } from 'react-router-dom';
import { ContactList } from './ContactList';
let landingStyle = require('../styles/landing.styl');

export class Landing extends React.Component<any, any> {
    render() {
        return <div className={landingStyle.content}>
            <h1>Contacts</h1>
            <ContactList />
        </div>;
    }
}
