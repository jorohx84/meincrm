export class Company {
    name: string;
    street: string;
    place: string;
    areacode: string
    email: string;


    constructor(company?: any) {
        this.name = company ? company.name : '';
        this.street = company ? company.street : '';
        this.place = company ? company.place : '';
        this.areacode = company ? company.areacode : '';
        this.email = company ? company.email : '';
    }

}