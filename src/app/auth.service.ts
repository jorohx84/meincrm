import { Injectable, inject } from "@angular/core";
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { UserService } from "./user.service";
import { Router } from "@angular/router";
import { Firestore, setDoc, addDoc, doc, collection } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    userservice = inject(UserService);
    auth = inject(Auth);
    router = inject(Router);
    firestore = inject(Firestore);

    async login(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(this.auth, email, password);
            console.log(this.userservice.user.uid);
            await this.userservice.setUserLoginTime(this.userservice.user);
            await this.userservice.setOnlineStatus('login', this.userservice.user.uid);
            await this.userservice.findCurrentUser(this.userservice.user.uid, this.userservice.user.displayName);

            setTimeout(() => {
                this.router.navigate(['/main'])
            }, 1000);
            console.log('Login war erfolgreich');
        } catch (error) {
            console.log(error);

        }



    }

    async addCompany(company: any) {
        const userCredential = await createUserWithEmailAndPassword(this.auth, company.email, "temporäresPasseort123");
        const user = userCredential.user;

        await this.addCompanytoFirestore(company, user);
        await sendPasswordResetEmail(this.auth, company.email);
        console.log('Firma erfolgreich angelegt', company);

    }

    async addCompanytoFirestore(company: any, user: any) {
        const companyCollectionRef = collection(this.firestore, 'companies');
        const companyData = this.createCompanyObject(company);
        const companyRef = await addDoc(companyCollectionRef, companyData);
        const companyID = companyRef.id;
        console.log('Neue Company-ID:', companyID);
        await updateProfile(user, {
            displayName: companyID,
        });

        const userCollectionRef = doc(this.firestore, `companies/${companyID}/users/${user.uid}`);
        const adminData = this.createAdminObject(company, companyID);
        await setDoc(userCollectionRef, adminData);

    }

    createCompanyObject(company: any) {
        return {
            name: company.name,
            street: company.street,
            place: company.place,
            areacode: company.areacode,
            email: company.email,
        };

    }

    createAdminObject(company: any, companyID: string) {
        return {
            name: 'Admin',
            email: company.email,
            role: 'admin',
            companyID: companyID,
            companyName: company.name,
            street: company.street,
            place: company.place,
            areacode: company.areacode,
            logindate: '',
            online: false,
        }
    }


    async addUser(newUser: any, currentUser: any, initials: string, userColor: string) {
      
        console.log(currentUser);
        console.log(newUser);
        const companyID = currentUser.companyID
        const userCredential = await createUserWithEmailAndPassword(this.auth, newUser.email, "temporäresPasswort123");
        const user = userCredential.user;
        console.log(user);
        console.log(currentUser);

        await updateProfile(user, {
            displayName: companyID,
        });


        const userDocRef = doc(this.firestore, `companies/${currentUser.companyID}/users/${user.uid}`);
        await setDoc(userDocRef, {
            name: newUser.name,
            email: newUser.email,
            companyID: currentUser.companyID,
            companyName: currentUser.companyName,
            messages: [],
            tasks: [],
            logindate: '',
            role: 'user',
            online: false,
            initials: initials,
            color: userColor,
        });
        
        sendPasswordResetEmail(this.auth, currentUser.email);



        console.log(newUser.name);
        console.log(newUser.email);


        console.log('user erfolgreich angelegt', newUser);

    }

}

