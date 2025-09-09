export class Contact {
    id: string;
    name: string;
    phone: number;
    email: string;
    function: string;
    customerName: string;
    customerID: string;

    constructor(contact?: any) {
        this.id = contact ? contact.id : '';
        this.name = contact ? contact.name : '';
        this.phone = contact ? contact.phone : '';
        this.email = contact ? contact.email : '';
        this.function = contact ? contact.function : '';
        this.customerName = contact ? contact.customerName : '';
        this.customerID = contact ? contact.customerID : '';
    }
}
