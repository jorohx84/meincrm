import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.class';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Company } from '../models/company.class';
@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [DataService],
})
export class AdminComponent {
  dataservice = inject(DataService);
  currentUser: any;
  companyID: string = '';
  companyName: string = '';
  user: any = new User()
  auth = inject(Auth);
  firestore = inject(Firestore);
  ngOnInit() {

    this.dataservice.getDataFromLocalStorage('user');
    this.currentUser = this.dataservice.data;
    console.log(this.currentUser);
    this.companyID = this.currentUser.companyID;
    this.companyName=this.currentUser.companyName;
    console.log(this.companyID);


  }


  async addUser() {

    await createUserWithEmailAndPassword(this.auth, this.user.email, "temporäresPasswort123")
      .then((userCredential) => {

        const user = userCredential.user;
        return updateProfile(user, {
          displayName: this.companyID,
        }).then(() => {
          const userDocRef = doc(this.firestore, `companies/${this.companyID}/users/${user.uid}`);
          return setDoc(userDocRef, {
            name: this.user.name,
            email: this.user.email,
            companyID: this.companyID,
            companyName: this.companyName,
            messages: [],
            tasks: [],
            logindate: '',
            role: 'user',

          }).then(() => {
            sendPasswordResetEmail(this.auth, this.user.email);
          })
        })
      })
    console.log(this.user.name);
    console.log(this.user.email);


    console.log('user erfolgreich angelegt');

  }
}
