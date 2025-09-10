export class Customer {
    name: string;
    street: string;
    city: string;
    areacode: string;
    phone: string;
    email: string;
    status: string;
    branch: string;
    outsideSales: any;
    insideSales: any;

    constructor(customer?: any) {
        this.name = customer?.name || '';
        this.street = customer?.street || '';
        this.city = customer?.city || '';
        this.areacode = customer?.areacode || '';
        this.phone = customer?.phone || '';
        this.email = customer?.email || '';
        this.status = customer?.status || '';
        this.branch = customer?.branch || '';
        this.outsideSales = customer?.outsideSales || '';
        this.insideSales = customer?.insideSales || '';
    }
}
