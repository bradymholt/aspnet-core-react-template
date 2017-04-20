import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { Contact } from './Contact';
import ContactService from '../services/Contacts'

let contactService = new ContactService();

export class ContactList extends React.Component<any, any> {
    state = {
        contacts: [] as any[]
    }

    componentDidMount() {
        contactService.getAll().then((contacts) => {
            this.setState({ contacts });
        });
    }

    render() {
        return <div>
            <ul>
                {this.state.contacts.map(contact =>
                    <li key={contact.contactId}>{contact.name}</li>
                )}
            </ul>
        </div>;
    }
}
