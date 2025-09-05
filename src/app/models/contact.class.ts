export class Contact {
    name: string;
    phone: number;
    email: string;
    function: string;

    constructor(contact?: any) {
        this.name = contact ? contact.name : '';
        this.phone = contact ? contact.phone : '';
        this.email = contact ? contact.email : '';
        this.function = contact ? contact.function : '';
    }
}
