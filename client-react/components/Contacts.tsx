import * as React from "react";
import { Link } from 'react-router-dom';
import { ContactList } from './ContactList';
import { ContactForm } from './ContactForm';
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { RoutePaths } from './Routes';
let contactsStyle = require('../styles/contacts.styl');

export class Contacts extends React.Component<any, any> {
    render() {
        return <div className={contactsStyle.content}>
            <h1>Contacts</h1>
            <Router>
                <Switch>
                    <Route exact path={RoutePaths.Contacts} component={ContactList} />
                    <Route path={RoutePaths.ContactEdit} component={ContactForm} />
                    <Route path={RoutePaths.ContactNew} component={ContactForm} />
                </Switch>
            </Router>
        </div>;
    }
}
