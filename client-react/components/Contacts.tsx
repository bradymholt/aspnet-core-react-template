import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import { ContactForm } from './ContactForm';
import ContactService, { IContact } from '../services/Contacts';
import { RouteComponentProps } from "react-router";

let contactService = new ContactService();

export class Contacts extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    }

    state = {
        contacts: [] as Array<IContact>,
        editContact: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    }

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        contactService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', contacts: response.content });
        });
    }

    handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSeachSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        contactService.search(this.state.searchQuery).then((response) => {
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
            <h1>Contacts</h1>
            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSeachSubmit(e)}>
                <input className="form-control form-control form-control-sm" type="text" value={this.state.searchQuery} onChange={(e) => this.handleSearchQueryChange(e)} placeholder="Search" />
                <button className="btn btn-outline-success btn-sm" type="submit">Search</button>&nbsp;
            </form>
            {this.state.searchQuery && this.state.contacts && this.state.contacts.length == 0 &&
                <p>No results!</p>
            }
            {this.state.contacts && this.state.contacts.length > 0 &&
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
                        {this.state.contacts.map((contact, index) =>
                            <tr key={contact.contactId}>
                                <td>{contact.lastName}</td>
                                <td>{contact.firstName}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td><Link to={RoutePaths.ContactEdit.replace(":id", contact.contactId.toString())}>edit</Link>
                                    <button type="button" className="btn btn-link" onClick={(e) => this.delete(contact)}>delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
            {this.state.searchQuery &&
                <button type="button" className="btn btn-primary" onClick={(e) => this.showAll()}>clear search</button>
            }
            <Link className="btn btn-success" to="/contacts/new">add</Link>

        </div>
    };
}
