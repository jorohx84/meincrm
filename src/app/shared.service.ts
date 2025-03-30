import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class SharedService {
    router = inject(Router);



    navigateToPath(path:string){
        this.router.navigate([path]);
    }
}