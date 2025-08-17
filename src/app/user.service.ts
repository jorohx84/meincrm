import { Injectable, inject } from "@angular/core";
import { Auth, onAuthStateChanged, signOut } from "@angular/fire/auth";
import { User } from "./models/user.class";
import { Firestore, collection, getDocs, doc, updateDoc } from "@angular/fire/firestore";
import { DataService } from "./data.service";
import { SharedService } from "./shared.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class UserService {
    auth = inject(Auth);
    dataservice = inject(DataService);
    sharedservice = inject(SharedService);
    user: any = new User;
    users: any[] = [];
    firestore = inject(Firestore);
    companyIdent: string | null = null;
    currentUser: any;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    isAdmin: boolean = false;
    isSuperAdmin: boolean = false;

    constructor() {
        this.setCurrentUser();
    }

    async getCurrentUser() {
        this.dataservice.getDataFromLocalStorage('user');
        this.currentUser = this.dataservice.data;
    }

    setCurrentUser() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.user = user;
                this.currentUserSubject.next(user);
                console.log(this.user);
                this.companyIdent = user.displayName;
                // this.dataservice.setCompanyID(this.companyIdent);
                this.dataservice.saveDataToLocalStorage('companyID', this.companyIdent,);
                console.log('User ist eingeloggt', this.user);

            } else {
                this.user = new User(null);
                console.log('User ist ausgeloggt');
                localStorage.removeItem('user');
            }

        })
    }


    setUserRole(user: any) {
        console.log(user);

        if (user) {
            if (user.role === 'admin') {
                this.isAdmin = true;
            }
            if (user.role === 'superadmin') {
                this.isSuperAdmin = true;
                this.isAdmin = true;
            }
            console.log(this.isAdmin);
            console.log(this.isSuperAdmin);
        }
    }

    async findCurrentUser(id: string, companyID: string) {
        console.log(companyID);
        this.users = await this.dataservice.getDataFromFirestore('users', companyID);
        console.log(this.users);
        const user = this.users.find(user => user.id === id);
        if (user) {
            this.dataservice.saveDataToLocalStorage('user', user);
            this.setUserRole(user)
            return user
        }
    }

    async setUserLoginTime(user: any) {
        const loginTime = new Date().toISOString();
        console.log(loginTime);

        console.log(this.companyIdent);

        const userDocRef = doc(this.firestore, `companies/${this.companyIdent}/users/${user.uid}`)
        await updateDoc(userDocRef, {
            logindate: loginTime,
        })

    }

    async setOnlineStatus(status: string, id: any) {
        let onlineStatus = false;
        if (status === 'login') {
            onlineStatus = true;
        }
        if (status === 'logout') {
            onlineStatus = false;
        }
        console.log(id);

        console.log(onlineStatus);

        await this.updateOnlineStatus(id, onlineStatus);
    }
    async updateOnlineStatus(id: string, onlineStatus: boolean) {
        const userDocRef = doc(this.firestore, `companies/${this.companyIdent}/users/${id}`);
        await updateDoc(userDocRef, {
            online: onlineStatus,
        })
    }


    logoutUser(user: any) {
        this.setOnlineStatus('logout', user.id);
        this.dataservice.saveDataToLocalStorage('component', null)
        this.dataservice.saveDataToLocalStorage('companyID', null);
        this.dataservice.saveDataToLocalStorage('fullscreen', null);
        this.dataservice.saveDataToLocalStorage('slide', null);
        this.dataservice.saveDataToLocalStorage('user', null);
        signOut(this.auth);
        setTimeout(() => {
            this.sharedservice.navigateToPath('/login');
        }, 1000);
    }
}
