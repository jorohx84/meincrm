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
    customerSubject = new BehaviorSubject<any>(null);
    customerSubject$ = this.customerSubject.asObservable();
    customerTemplate: string = 'dashboard';
    navigateToPath(path: string) {
        this.router.navigate([path]);
    }

    constructor() {
        this.dataservice.getDataFromLocalStorage('isCard');
        this.isCard = this.dataservice.data;
    }

    changeComponents(component: string) {
        this.component = component;
        console.log(this.component);
        this.dataservice.saveDataToLocalStorage('component', component);
    }

    changeDepiction(key: string) {
        key === 'cards' ? this.isCard = true : this.isCard = false;
        console.log(this.isCard);
        this.dataservice.saveDataToLocalStorage('isCard', this.isCard);
    }


    sendCustomerData(customer: any) {
        console.log(customer);
        this.customerSubject.next(customer);
    }


}
