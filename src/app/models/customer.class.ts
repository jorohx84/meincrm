export class Customer {
    name: string;
    street: string;
    city: string;
    areacode: string;
    phone: string;
    email: string;
    status: string;
    branch: string;
    outsideSales: string;
    insideSales: string;
    favorites: any[];
    description: string;
    createdBy: any;
    mainContactID: string;
    notes: string;

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
        this.favorites = customer?.favorites || [];
        this.description = customer?.description || '';
        this.createdBy = customer?.createdBy || {};
        this.mainContactID = customer?.mainContactID || {};
        this.notes = customer?.notes || '';
    }
}
