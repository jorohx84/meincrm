import { CommonModule } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'
import { Company } from '../models/company.class';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

import { CompanyService } from '../company.service';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-addcompany',
  imports: [CommonModule, FormsModule],
  templateUrl: './addcompany.component.html',
  styleUrl: './addcompany.component.scss'
})
export class AddcompanyComponent {
  company: any = new Company();
  firestore = inject(Firestore);
  auth = inject(Auth);
  companyservice = inject(CompanyService);
  sharedservice = inject(SharedService)

  async onSubmit(companyaccount: NgForm) {

    await createUserWithEmailAndPassword(this.auth, this.company.email, "temporäresPasseort123")
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: user.uid,

        }).then(() => {
          const companyDocRef = doc(this.firestore, `companies/${user.uid}`);
          return setDoc(companyDocRef, {
            name: this.company.name,
            street: this.company.street,
            place: this.company.place,
            areacode: this.company.areacode,
            email: this.company.email,
          }).then(() => {
            const userDocRef = doc(this.firestore, `companies/${user.uid}/users/${user.uid}`);
            return setDoc(userDocRef, {
              name: 'Admin',
              email: this.company.email,
              role: 'admin',
              companyID: user.uid,
              companyName:this.company.name,
              street: this.company.street,
              place: this.company.place,
              areacode: this.company.areacode,
              logindate:'',
              online:false,
            }).then(() => {
              sendPasswordResetEmail(this.auth, this.company.email);
            })
          })
        })
      })

    this.companyservice.setCompany(this.company);



    console.log('Firma erfolgreich angelegt');

  }
}
