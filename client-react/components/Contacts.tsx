import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import { ContactForm } from './ContactForm';
import ContactService, { IContact } from '../services/Contacts';
import { RouteComponentProps } from "react-router";
import { Table, Message, Form, Divider, Button, Input, Header } from 'semantic-ui-react';

let contactService = new ContactService();

export class Contacts extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    };

    state = {
        contacts: [] as Array<IContact>,
        editContact: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    };

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

    handleSeachSubmit = () => {
        event.preventDefault();

        if(!this.state.searchQuery){
            this.showAll();
            return;
        }

        contactService.search(this.state.searchQuery).then((response) => {
            this.setState({ contacts: response.content });
        });
    }

    delete(contact: IContact) {
        contactService.delete(contact.id).then((response) => {
            let updatedContacts = this.state.contacts;
            updatedContacts.splice(updatedContacts.indexOf(contact), 1);
            this.setState({ contacts: updatedContacts });
        });
    }

    render() {
        return <div>
            <Header as='h1'>Contacts</Header>
            <Form onSubmit={this.handleSeachSubmit}>
                <Input 
                    value={this.state.searchQuery} 
                    onChange={this.handleSearchQueryChange.bind(this)}  
                    action='Search' 
                    placeholder='Search...' 
                />
            </Form>
            <Divider hidden/>
            {this.state.searchQuery && this.state.contacts && this.state.contacts.length == 0 &&
                <Message header='No results!' content='Try with another keyword'/>
            }
            {this.state.contacts && this.state.contacts.length > 0 &&
                <Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>First Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.contacts.map((contact, index) =>
                            <Table.Row key={contact.id}>
                                <Table.Cell>{contact.lastName}</Table.Cell>
                                <Table.Cell>{contact.firstName}</Table.Cell>
                                <Table.Cell>{contact.email}</Table.Cell>
                                <Table.Cell>{contact.phone}</Table.Cell>
                                <Table.Cell>
                                    <Button size='small' basic onClick={() => this.props.history.push(RoutePaths.ContactEdit.replace(":id", contact.id.toString()))}>Edit</Button>
                                    <Button size='small' basic color='red' danger onClick={(e) => this.delete(contact)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        )}                       
                    </Table.Body>
                </Table>
            }
            <Divider hidden/>
            <Button.Group>
                {this.state.searchQuery &&
                    <Button onClick={(e) => this.showAll()}>Clear search</Button>
                }
                <Button positive onClick={() => this.props.history.push(RoutePaths.ContactNew)}>Add</Button>
            </Button.Group>
        </div>
    };
}
