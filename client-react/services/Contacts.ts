import RestUtilities from './RestUtilities';

export interface IContact {
    contactId: number,
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

    save(contact: IContact) {
        return RestUtilities.put<IContact>('/api/contacts', contact);
    }

    create(contact: IContact) {
        return RestUtilities.post<IContact>('/api/contacts', contact);
    }

    delete(contactId: string) {
        return RestUtilities.delete(`/api/contacts/${contactId}`);
    }
}

