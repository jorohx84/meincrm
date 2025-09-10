import { Injectable, inject } from "@angular/core";
import { Auth, onAuthStateChanged, signOut } from "@angular/fire/auth";
import { User } from "./models/user.class";
import { Firestore, collection, getDocs, doc, updateDoc } from "@angular/fire/firestore";
import { DataService } from "./data.service";
import { SharedService } from "./shared.service";
import { BehaviorSubject } from "rxjs";
import { Company } from "./models/company.class";

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
    private usersSubject = new BehaviorSubject<any>(null);
    public usersSubject$ = this.usersSubject.asObservable();
    isAdmin: boolean = false;
    isSuperAdmin: boolean = false;

    constructor() {
        this.setCurrentUser();

    }

    // async getCurrentUser() {
    //     this.dataservice.getDataFromLocalStorage('user');
    //     this.currentUser = this.dataservice.data;
    // }

    setCurrentUser() {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                this.user = user;
                // this.companyIdent = user.displayName;
                const companyID = user.displayName;
                await this.intitializeData(user, companyID ?? '');
                // const currentUser = await this.findCurrentUser(user.uid, this.companyIdent ?? '');
                // await this.dataservice.loadCustomers(this.companyIdent ?? '')
                // this.currentUserSubject.next(currentUser);
                // this.dataservice.saveDataToLocalStorage('companyID', this.companyIdent,);
                await this.setUserLoginTime(user);
                await this.setOnlineStatus('login', user);
                console.log('User ist eingeloggt', this.user);

            } else {
                this.user = new User(null);
                console.log('User ist ausgeloggt');
                localStorage.removeItem('user');
            }

        })
    }

    async intitializeData(user: any, companyID: string) {
        if (companyID) {
            const currentUser = await this.findCurrentUser(user.uid, companyID);
            this.currentUserSubject.next(currentUser);
            await this.dataservice.loadCustomers(companyID)
            this.dataservice.saveDataToLocalStorage('companyID', companyID);
        }

    }


    setUserRole(user: any) {

        if (user) {
            if (user.role === 'admin') {
                this.isAdmin = true;
            }
            if (user.role === 'superadmin') {
                this.isSuperAdmin = true;
                this.isAdmin = true;
            }
        }
    }

    async findCurrentUser(id: string, companyID: string) {
        this.users = await this.dataservice.getDataFromFirestore('users', companyID);
        this.usersSubject.next(this.users);
        const user = this.users.find(user => user.id === id);
        if (user) {
            this.dataservice.saveDataToLocalStorage('user', user);
            this.setUserRole(user);
            return user
        }
    }


    async setUserLoginTime(user: any) {
        const loginTime = new Date().toISOString();
        const companyID = user.displayName
        console.log(companyID);
        console.log(user.uid);


        const userDocRef = doc(this.firestore, `companies/${companyID}/users/${user.uid}`)
        await updateDoc(userDocRef, {
            logindate: loginTime,
        })

    }

    async setOnlineStatus(status: string, user: any) {
        let onlineStatus = false;
        if (status === 'login') {
            onlineStatus = true;
        }
        if (status === 'logout') {
            onlineStatus = false;
        }
        console.log(user);
        
        if (user) {
            const companyID = user.displayName;
            console.log(companyID);

            await this.updateOnlineStatus(user.uid, onlineStatus, companyID);
        }

    }

    async updateOnlineStatus(id: string, onlineStatus: boolean, companyID: string) {
        console.log(id);
        console.log(companyID);


        const userDocRef = doc(this.firestore, `companies/${companyID}/users/${id}`);
        await updateDoc(userDocRef, {
            online: onlineStatus,
        })
    }


    logoutUser(user: any) {
        this.setOnlineStatus('logout', user.id);
        this.dataservice.saveDataToLocalStorage('component', null)
        this.dataservice.saveDataToLocalStorage('companyID', null);
        this.dataservice.saveDataToLocalStorage('fullscreen', null);
        this.dataservice.saveDataToLocalStorage('slide', false);
        this.dataservice.saveDataToLocalStorage('user', null);
        this.dataservice.saveDataToLocalStorage('customer', null);
        signOut(this.auth);
        setTimeout(() => {
            this.sharedservice.navigateToPath('/login');
        }, 1000);
    }
}
