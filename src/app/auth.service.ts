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
    initials: string = '';

    colors: string[] = [
        "#FAD02E", // Pastellgelb
        "#F28D35", // Pastellorange
        "#F25F5C", // Pastellrot
        "#D4A5A5", // Pastellrosa
        "#6B4226", // Pastellbraun
        "#F7B7A3", // Helles Rosa
        "#C1D3FE", // Helles Blau
        "#A4B7F1", // Pastellblau
        "#D6E6F2", // Helles Himmelblau
        "#8FD9B6", // Pastellgrün
        "#F1E9D2", // Blassgelb
        "#FFC3A0", // Helles Apricot
        "#FFADAB", // Pastellpink
        "#A9DFBF", // Sanftes Grün
        "#D9EAD3", // Zartgrün
        "#E9C7A4", // Helles Beige
        "#C9A0DC", // Lavendel
        "#B3C6D9", // Helles Blau
        "#E3F2A7", // Helles Lime
        "#B4E1FF", // Zartes Blau
    ];


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


    async addUser(name: string, email: string, password: string, companyID: string, companyName: string) {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: companyID,
        })
        const userData = this.getUserObject(name, email, companyID, companyName);
        const userRef = doc(this.firestore, `companies/${companyID}/users/${user.uid}`)
        await setDoc(userRef, userData)
        console.log('user erfolgreich angelegt');

    }


    getUserObject(name: string, email: string, companyID: string | null, companyName: string) {
        const colors = this.getRandomColor();
        this.findInitials(name);
        return {
            name: name,
            email: email,
            companyID: companyID,
            companyName: companyName,
            messages: [],
            tasks: [],
            logindate: '',
            role: 'user',
            online: false,
            initials: this.initials,
            color: colors,

        }
    }

    findInitials(name: string) {
        const nameParts = name.trim().split(' ');
        console.log(nameParts);

        if (nameParts.length > 1) {
            const firstInitial = nameParts[0].charAt(0).toUpperCase(); // Erste Initiale des Vornamens
            const lastInitial = nameParts[1].charAt(0).toUpperCase(); // Erste Initiale des Nachnamens

            this.initials = firstInitial + lastInitial; // Die Initialen kombinieren
        } else if (nameParts.length === 1) {
            // Wenn nur der Vorname vorhanden ist
            this.initials = nameParts[0].charAt(0).toUpperCase(); // Nur die Initiale des Vornamens
        } else {
            this.initials = ''; // Falls kein Name eingegeben wurde
        }

    }

    getRandomColor(): string {
        const randomIndex = Math.floor(Math.random() * this.colors.length); // Zufälligen Index generieren
        return this.colors[randomIndex]; // Die zufällige Farbe zurückgeben
    }
}

