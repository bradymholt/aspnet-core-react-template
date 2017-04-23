import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import { ContactForm } from './ContactForm';
import ContactService, { IContact } from '../services/Contacts';
import { RouteComponentProps } from "react-router";

let contactService = new ContactService();

export class ContactList extends React.Component<RouteComponentProps<any>, any> {
    state = {
        contacts: [] as Array<IContact>,
        editContact: null as Object,
        isAddMode: false as boolean
    }

    componentDidMount() {
        contactService.fetchAll().then((response) => {
            this.setState({ contacts: response.content });
        });
    }

    delete(contact: IContact) {
        contactService.delete(contact.contactId).then((response) => {
            let updatedContacts = this.state.contacts;
            updatedContacts.splice(updatedContacts.indexOf(contact), 1);
            this.setState({ contacts: updatedContacts });
        });
    }

    render() {
        return <div>
            <table className="table">
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
                    {this.state.contacts && this.state.contacts.map((contact, index) =>
                        <tr key={contact.contactId}>
                            <td>{contact.lastName}</td>
                            <td>{contact.firstName}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td><Link to={`/contacts/edit/${contact.contactId}`}>edit</Link>
                            <button type="button" className="btn btn-link" onClick={(e) => this.delete(contact)}>delete</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link to="/contacts/new">add</Link>
        </div>
    };
}
