import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { Contact } from './Contact';
import ContactService, { IContact } from '../services/Contacts'

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
        let contacts = this.state.contacts;
        contacts.splice(this.state.contacts.indexOf(contact), 1);
        this.setState({ contacts });
    }

    edit(contact: IContact) {
        this.setState({ editContact: contact });
    }

    add() {
        this.setState({ editContact: {}, isAddMode: true });
    }

    onSave(contact: IContact) {
        contactService.save(contact);
        this.setState({ editContact: null, isAddMode: false, contacts: [] });
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
                        {this.state.contacts.map(contact =>
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
