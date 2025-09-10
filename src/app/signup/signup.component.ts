import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.class';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { addDoc, collection } from 'firebase/firestore';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  authservice = inject(AuthService);
  router = inject(Router);
  link = inject(ActivatedRoute);
  currentUser: any;
  companyID: string | null = null;
  email: string | null = null;
  name: string | null = null;
  companyName: string | null = null;
  user: any = new User()
  auth = inject(Auth);
  firestore = inject(Firestore);
  initials: string = '';


  ngOnInit(): void {

    this.link.queryParamMap.subscribe(params => {
      this.companyID = params?.get('companyId');
      this.email = params?.get('email');
      this.name = params?.get('name');
      this.companyName = params?.get('companyName');
      this.user.email = params?.get('email');
      this.user.name = params?.get('name');
    })



  }




  async addUser() {
    await this.authservice.addUser(this.user.name, this.user.email, this.user.password, this.companyID ?? '', this.companyName ?? '');
    setTimeout(() => {
      this.sharedservice.navigateToPath('main');
    }, 1000);
    // const userCredential = await createUserWithEmailAndPassword(this.auth, this.user.email, this.user.password);
    // const user = userCredential.user;

    // await updateProfile(user, {
    //   displayName: this.companyID,
    // })
    // console.log(user);

    // const userData = this.getUserObject();
    // console.log(userData);
    // const userRef = doc(this.firestore, `companies/${this.companyID}/users/${user.uid}`)
    // await setDoc(userRef, userData)
    // console.log('user erfolgreich angelegt');

  }

  // getUserObject() {
  //   const colors = this.getRandomColor();
  //   this.findInitials();
  //   return {
  //     name: this.user.name,
  //     email: this.user.email,
  //     companyID: this.companyID,
  //     companyName: this.companyName,
  //     messages: [],
  //     tasks: [],
  //     logindate: '',
  //     role: 'user',
  //     online: false,
  //     initials: this.initials,
  //     color: colors,

  //   }
  // }

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


}

