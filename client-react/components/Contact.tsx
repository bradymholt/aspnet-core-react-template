import 'object-assign';
import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import ContactService from '../services/Contacts'

let contactService = new ContactService();

interface ContactProps {
    contact: any;
    onSave: any;
}

export class Contact extends React.Component<ContactProps, any> {
    state = {
        contact: this.props.contact,
        errors: {} as { [key: string]: string }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.onSave(this.state.contact);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let contactUpdates = {
            [name]: value
        }

        let updated = Object.assign({}, this.props.contact, contactUpdates);
        this.setState({
            contact: updated
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
        return <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className={this._formGroupClass(this.state.errors.lastName)}>
                <label htmlFor="inputLastName" className="form-control-label">First Name</label>
                <input type="text" name="name" id="inputLastName" value={this.state.contact.lastName} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                <div className="form-control-feedback">{this.state.errors.lastName}</div>
            </div>
            <div className={this._formGroupClass(this.state.errors.firstName)}>
                <label htmlFor="inputFirstName" className="form-control-label">First Name</label>
                <input type="text" id="inputFirstName" ref="firstName" value={this.state.contact.firstName} className="form-control form-control-danger" required />
                <div className="form-control-feedback">{this.state.errors.firstName}</div>
            </div>
            <div className={this._formGroupClass(this.state.errors.email)}>
                <label htmlFor="inputEmail" className="form-control-label">Email</label>
                <input type="email" id="inputEmail" ref="email" value={this.state.contact.email} className="form-control form-control-danger" required />
                <div className="form-control-feedback">{this.state.errors.email}</div>
            </div>
            <div className={this._formGroupClass(this.state.errors.phone)}>
                <label htmlFor="inputPhone" className="form-control-label">Phone</label>
                <input type="tel" id="inputPhone" ref="phone" value={this.state.contact.phone} className="form-control form-control-danger" required />
                <div className="form-control-feedback">{this.state.errors.phone}</div>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Save</button>
        </form>
    }
}
