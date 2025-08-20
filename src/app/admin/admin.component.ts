import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.class';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Company } from '../models/company.class';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { useReducer } from 'react';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [DataService],
})
export class AdminComponent {
  dataservice = inject(DataService);
  userservice = inject(UserService);
  authservice = inject(AuthService);
  http = inject(HttpClient);
  currentUser: any;
  companyID: string = '';
  companyName: string = '';
  user: any = new User()
  auth = inject(Auth);
  firestore = inject(Firestore);
  initials: string = '';
  inviteLink: string | null = null;


  ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        const companyID = user?.displayName;
        this.currentUser = user;
        this.companyID = this.currentUser.companyID
        this.companyName = this.currentUser.companyName;
        console.log(this.currentUser);
        
      }
    });
  }


  async inviteUser() {
    const generatedLink = this.generateSignupLink(this.user.name, this.user.email);
    this.inviteLink = generatedLink;

    const to = encodeURIComponent(this.user.email);
    const subject = encodeURIComponent('Einladung zur Registrierung bei mapleCRM');
    const body = encodeURIComponent(
      `Hallo ${this.user.name},\n\n\n hier ist dein Link zur Registrierung bei mapleCRM:\n\n ${generatedLink}\n\n\n Freundliche Grüße \n\n Ihr ${this.currentUser.name}
      `);

    const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    // Optional: Felder leeren, falls du willst
    this.user.email = '';
    this.user.name = '';
  }


  generateSignupLink(name?: string, email?: string): string {
    const baseUrl = window.location.origin + '/signup';
    const params = new URLSearchParams();
    params.set('companyId', this.companyID);
    params.set('companyName', this.companyName)
    if (email) {
      params.set('email', email);
    }
    if (name) {
      params.set('name', name);
    }

    return `${baseUrl}?${params.toString()}`;
  }


  // findInitials() {
  //   const nameParts = this.user.name.trim().split(' ');
  //   console.log(nameParts);

  //   if (nameParts.length > 1) {
  //     const firstInitial = nameParts[0].charAt(0).toUpperCase(); // Erste Initiale des Vornamens
  //     const lastInitial = nameParts[1].charAt(0).toUpperCase(); // Erste Initiale des Nachnamens

  //     this.initials = firstInitial + lastInitial; // Die Initialen kombinieren
  //   } else if (nameParts.length === 1) {
  //     // Wenn nur der Vorname vorhanden ist
  //     this.initials = nameParts[0].charAt(0).toUpperCase(); // Nur die Initiale des Vornamens
  //   } else {
  //     this.initials = ''; // Falls kein Name eingegeben wurde
  //   }

  // }

  // getRandomColor(): string {
  //   const randomIndex = Math.floor(Math.random() * this.colors.length); // Zufälligen Index generieren
  //   return this.colors[randomIndex]; // Die zufällige Farbe zurückgeben
  // }



  // const colors = this.getRandomColor();
  // this.findInitials();
  // await this.authservice.addUser(this.user, this.currentUser, this.initials, colors);

  // await createUserWithEmailAndPassword(this.auth, this.user.email, "temporäresPasswort123")
  //   .then((userCredential) => {

  //     const user = userCredential.user;
  //     return updateProfile(user, {
  //       displayName: this.companyID,
  //     }).then(() => {
  //       this.findInitials();
  //       const userColor = this.getRandomColor();
  //       const userDocRef = doc(this.firestore, `companies/${this.companyID}/users/${user.uid}`);
  //       return setDoc(userDocRef, {
  //         name: this.user.name,
  //         email: this.user.email,
  //         companyID: this.companyID,
  //         companyName: this.companyName,
  //         messages: [],
  //         tasks: [],
  //         logindate: '',
  //         role: 'user',
  //         online: false,
  //         initials: this.initials,
  //         color: userColor,
  //       }).then(() => {
  //         sendPasswordResetEmail(this.auth, this.user.email);
  //       })
  //     })
  //   })
  // console.log(this.user.name);
  // console.log(this.user.email);


  // console.log('user erfolgreich angelegt');
}

