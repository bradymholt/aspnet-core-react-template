import 'object-assign';
import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import ContactService, { IContact } from '../services/Contacts'
import { RoutePaths } from './Routes';
import { Icon, Message, Loader, Grid, Form, Segment, Divider, Button, Input, Label } from 'semantic-ui-react';

let contactService = new ContactService();

export class ContactForm extends React.Component<RouteComponentProps<any>, any> {
    state = {
        contact: null as IContact,
        errors: {} as { [key: string]: string }
    }

    componentDidMount() {
        if (this.props.match.path == RoutePaths.ContactEdit) {
            contactService.fetch(this.props.match.params.id).then((response) => {
                this.setState({ contact: response.content });
            });
        } else {
            let newContact: IContact = {
                lastName: '', firstName: '', email: '', phone: ''
            };
            this.setState({ contact: newContact });
        }
    }

    handleSubmit = () => {
        event.preventDefault();
        this.saveContact(this.state.contact);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let contactUpdates = {
            [name]: value
        };

        this.setState({
            contact: Object.assign(this.state.contact, contactUpdates)
        });
    }

    saveContact(contact: IContact) {
        this.setState({ errors: {} as { [key: string]: string } });
        contactService.save(contact).then((response) => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Contacts);
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    _formGroupClass(field: string) {
        var className = "form-group ";
        if (field) {
            className += " has-danger"
        }
        return className;
    }

    render() {
        if (!this.state.contact) {
            return <Loader size='big' active inline='centered'>Loading </Loader>;
        }
        else {
            return <div>
                <Grid centered columns={1}>
                    <Grid.Column>
                        <Message
                            attached
                            header={this.state.contact.id ? "Edit Contact" : "New Contact" }
                        />
                        {this.state.errors && Object.keys(this.state.errors).length !== 0 && this.state.errors.constructor === Object &&
                            <Message icon='warning sign' attached error role="alert" list={Object.keys(this.state.errors).map(key => this.state.errors[key])} />
                        }
                        <Form className="segment attached" onSubmit={this.handleSubmit}>
                            <Form.Field required error={this.state.errors.lastName && true}>
                                <label htmlFor="inputLastName">Last Name</label>
                                <input 
                                    type="text" 
                                    autoFocus 
                                    name="lastName" 
                                    id="inputLastName" 
                                    value={this.state.contact.lastName} 
                                    onChange={(e) => this.handleInputChange(e)} 
                                    required 
                                />
                               {this.state.errors.lastName && <Label basic color='red' pointing>{this.state.errors.lastName}</Label>}
                            </Form.Field>
                            <Form.Field required error={this.state.errors.firstName && true}>
                                <label htmlFor="inputFirstName">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    id="inputFirstName" 
                                    value={this.state.contact.firstName} 
                                    onChange={(e) => this.handleInputChange(e)} 
                                    required 
                                />
                                {this.state.errors.firstName && <Label basic color='red' pointing>{this.state.errors.firstName}</Label>}
                            </Form.Field>
                            <Form.Field error={this.state.errors.email && true}>
                                <label htmlFor="inputEmail">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="inputEmail" 
                                    value={this.state.contact.email} 
                                    onChange={(e) => this.handleInputChange(e)} 
                                />
                                {this.state.errors.email && <Label basic color='red' pointing>{this.state.errors.email}</Label>}                           
                            </Form.Field>
                            <Form.Field error={this.state.errors.phone && true}>
                                <label htmlFor="inputPhone">Phone</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    id="inputPhone" 
                                    value={this.state.contact.phone} 
                                    onChange={(e) => this.handleInputChange(e)}
                                />
                                {this.state.errors.phone && <Label basic color='red' pointing>{this.state.errors.phone}</Label>}                            
                            </Form.Field>
                            <Button.Group>
                                <Button positive>Save</Button>
                                <Button onClick={() => this.props.history.push(RoutePaths.Contacts)}>Cancel</Button>
                            </Button.Group>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        }
    }
}
