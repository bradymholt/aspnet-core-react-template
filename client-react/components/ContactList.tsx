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

    delete(contact: any) {
        let contacts = this.state.contacts;
        contacts.splice(this.state.contacts.indexOf(contact), 1);
        this.setState({ contacts });
    }

    render() {
        return <table className="table">
            <thead>
                <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.state.contacts.map(contact =>
                    <tr key={contact.contactId}>
                        <td>{contact.name}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                        <td><button type="button" className="btn btn-link" onClick={(e) => this.delete(contact)}>delete</button></td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}
