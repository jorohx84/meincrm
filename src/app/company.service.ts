import { inject, Injectable } from "@angular/core";
import { Company } from "./models/company.class";
@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    company: any = new Company;


    setCompany(company: any) {
        this.company = company
        console.log(this.company);

    }
}