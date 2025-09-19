import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "./data.service";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class SharedService {
    dataservice = inject(DataService);
    router = inject(Router);
    isLogin = true;
    isFullscreen: boolean = false;
    isSlide: boolean = true;
    component: string = '';
    currentUser: any;
    counter: number = 0;
    customer: any;
    companyID: string = '';
    isCard: boolean | null = null;
    userListOpen: boolean = false;
    isNewCustomer: boolean = false;
    confirmationOpen: boolean = false;
    private customerSubject = new BehaviorSubject<any>(null);
    public customerSubject$ = this.customerSubject.asObservable();

    private userSubject = new BehaviorSubject<any>(null);
    public userSubject$ = this.userSubject.asObservable();
    customerTemplate: string = 'dashboard';



    navigateToPath(path: string) {
        this.router.navigate([path]);
    }

    constructor() {
        this.dataservice.getDataFromLocalStorage('isCard');
        this.isCard = this.dataservice.data;
        this.dataservice.getDataFromLocalStorage('editState');
        this.isNewCustomer = this.dataservice.data;
    }

    changeComponents(component: string) {
        this.component = component;
        this.dataservice.saveDataToLocalStorage('component', component);
    }

    changeDepiction(key: string) {
        key === 'cards' ? this.isCard = true : this.isCard = false;
        this.dataservice.saveDataToLocalStorage('isCard', this.isCard);
    }


    sendCustomerData(customer: any) {
        console.log(customer);
        this.customerSubject.next(customer);
    }

    changeTemplate(cardKey: string) {
        this.customerTemplate = cardKey;
        this.dataservice.saveDataToLocalStorage('customerTemplate', cardKey);
        // this.dataservice.customerID = this.customer.id;
        // this.dataservice.companyID = this.currentUser.companyID;

    }

    sendUserFromList(user: any) {
        this.userSubject.next(user);

    }

}
