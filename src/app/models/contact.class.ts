export class Contact {
    id: string;
    name: string;
    phone: number;
    email: string;
    function: string;
    customerName: string;
    customerID: string;
    isVIP: boolean;
    isMainContact: boolean;

    constructor(contact?: any) {
        this.id = contact ? contact.id : '';
        this.name = contact ? contact.name : '';
        this.phone = contact ? contact.phone : '';
        this.email = contact ? contact.email : '';
        this.function = contact ? contact.function : '';
        this.customerName = contact ? contact.customerName : '';
        this.customerID = contact ? contact.customerID : '';
        this.isVIP = contact = contact ? contact.isVIP : false;
        this.isMainContact = contact ? contact.isMainContact : false;
    }
}
