import RestUtilities from './RestUtilities';

export interface IContact {
    id?: number,
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
}

export default class Contacts {
    fetchAll() {
        return RestUtilities.get<Array<IContact>>('/api/contacts');
    }

    fetch(contactId: number) {
        return RestUtilities.get<IContact>(`/api/contacts/${contactId}`);
    }

    search(query: string) {
        return RestUtilities.get<Array<IContact>>(`/api/contacts/search/?q=${query}`);
    }

    update(contact: IContact) {
        return RestUtilities.put<IContact>(`/api/contacts/${contact.id}`, contact);
    }

    create(contact: IContact) {
        return RestUtilities.post<IContact>('/api/contacts', contact);
    }

    save(contact: IContact) {
        if (contact.id) {
            return this.update(contact);
        } else {
            return this.create(contact);
        }
    }

    delete(contactId: number) {
        return RestUtilities.delete(`/api/contacts/${contactId}`);
    }
}

