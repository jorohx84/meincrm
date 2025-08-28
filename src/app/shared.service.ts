import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "./data.service";


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

    navigateToPath(path: string) {
        this.router.navigate([path]);
    }

    changeComponents(component: string) {
        this.component = component;
        console.log(this.component);
        this.dataservice.saveDataToLocalStorage('component', component);
    }


}