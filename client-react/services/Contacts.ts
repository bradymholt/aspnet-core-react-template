import Service from './Service';

export default class Contacts extends Service {
    getAll(): Promise<any> {
        return this.getJSON('/api/contacts');
    }
}

