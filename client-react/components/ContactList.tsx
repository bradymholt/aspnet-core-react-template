import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import { Contact } from './Contact';
import ContactService, { IContact } from '../services/Contacts';

import { History } from './Routes';

let contactService = new ContactService();

export class ContactList extends React.Component<any, any> {
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

    edit(contact: IContact) {
        History.push(`${RoutePaths.Landing}/edit`);
        this.setState({ editContact: contact });
    }

    add() {
        let newContact: IContact = {
            lastName: '', firstName: '', email: '', phone: ''
        };
        this.setState({ editContact: newContact, isAddMode: true });
    }

    onSave(contact: IContact) {
        let contacts = this.state.contacts;

        if (this.state.isAddMode) {
            contactService.create(contact).then((response) => {
                contacts.push(response.content);
                this.setState({ editContact: null, isAddMode: false, contacts: contacts });
            });
        } else {
            contactService.update(contact).then((response) => {
                let existingContact = contacts.find((c) => c.contactId == contact.contactId);
                let updatedContact = Object.assign({}, existingContact, response.content) as IContact;
                contacts[contacts.indexOf(existingContact)] = updatedContact;
                this.setState({ editContact: null, isAddMode: false, contacts: contacts });
            });
        }
    }

    render() {
        if (this.state.editContact || this.state.isAddMode) {
            return <Contact onSave={(c: any) => this.onSave(c)} contact={this.state.editContact}></Contact>
        } else {
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
                                <td><button type="button" className="btn btn-link" onClick={(e) => this.edit(contact)}>edit</button>&nbsp;
                            <button type="button" className="btn btn-link" onClick={(e) => this.delete(contact)}>delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button type="button" className="btn btn-link" onClick={(e) => this.add()}>add</button>
            </div>
        };
    }
}
