import { Injectable, inject } from "@angular/core";
import { Auth, onAuthStateChanged } from "@angular/fire/auth";
import { User } from "./models/user.class";
import { Firestore, collection, getDocs, doc, updateDoc } from "@angular/fire/firestore";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    auth = inject(Auth);
    dataservice = inject(DataService);
    user: any = new User;
    users: any[] = [];
    firestore = inject(Firestore);
    companyIdent: string | null = null;
    currentUser: any;
    isAdmin: boolean = false;
    isSuperAdmin: boolean = false;


    constructor() {
        this.setCurrentUser();
        this.getCurrentUser();
        this.setUserRole();
    }


    getCurrentUser() {
        this.dataservice.getDataFromLocalStorage('user');
        this.currentUser = this.dataservice.data;

    }

    setCurrentUser() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.user = user;
                this.companyIdent = user.displayName;
                console.log('User ist eingeloggt', this.user);
            } else {
                this.user = new User(null);
                console.log('User ist ausgeloggt');
                localStorage.removeItem('user');
            }

        })
    }
    setUserRole() { 
            if (this.currentUser.role === 'admin') {
              this.isAdmin = true;
            }
            if (this.currentUser.role === 'superadmin') {
              this.isSuperAdmin = true;
              this.isAdmin = true;
            }
        
            console.log(this.isAdmin);
            console.log(this.isSuperAdmin);
    }

    async findCurrentUser(id: string) {
        console.log(this.companyIdent);

        this.users = await this.getUsers(this.companyIdent);

        console.log(this.users);

        const user = this.users.find(user => user.id === id);
        if (user) {
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            return user
        }
    }

    async setUserLoginTime() {
        const loginTime = new Date().toISOString();
        console.log(loginTime);
        console.log(this.companyIdent);
        console.log(this.user.id);

        const userDocRef = doc(this.firestore, `companies/${this.companyIdent}/users/${this.user.id}`)
        await updateDoc(userDocRef, {
            logindate: loginTime,
            online: true,
        })

    }

    async getUsers(companyID: string | null) {
        try {
            const usersCollection = collection(this.firestore, `companies/${companyID}/users`);
            const userSnapshot = await getDocs(usersCollection);
            return userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    }
}
