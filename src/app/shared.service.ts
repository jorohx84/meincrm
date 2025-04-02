import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class SharedService {
    router = inject(Router);
    isLogin = true;
    isFullscreen: boolean = false;
    isSlide: boolean = false;
    component: string = '';

    navigateToPath(path: string) {
        this.router.navigate([path]);
    }


}