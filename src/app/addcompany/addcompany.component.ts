import { CommonModule } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'
import { Company } from '../models/company.class';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

import { CompanyService } from '../company.service';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { SharedService } from '../shared.service';
import { AuthService } from '../auth.service';



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
  authservice = inject(AuthService);



  async onSubmit(companyaccount: NgForm) {

    await this.authservice.addCompany(this.company);

  }
}
