import { Injectable, inject } from "@angular/core";
import { Auth, onAuthStateChanged } from "@angular/fire/auth";
import { User } from "./models/user.class";
import { Firestore, collection, getDocs } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    auth = inject(Auth);
    user: any = new User;
    users: any[] = [];
    firestore = inject(Firestore);
    companyIdent: string | null = null;



    constructor() {
        console.log('Hallo');

        this.setCurrentUser();
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
