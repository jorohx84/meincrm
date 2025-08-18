import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Customer } from '../models/customer.class';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc } from 'firebase/firestore';


@Component({
  selector: 'app-customercreation',
  imports: [CommonModule, FormsModule],
  templateUrl: './customercreation.component.html',
  styleUrl: './customercreation.component.scss'
})
export class CustomercreationComponent {
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  firestore = inject(Firestore);
  customer: any = new Customer();
  currentUser: any;


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
      }

    })


  }

  async addCustomer() {
    const customerData = this.getCostumerObject();
    const companyID = this.currentUser.companyID
    const docRef = collection(this.firestore, `companies/${companyID}/customers/`)
    await addDoc(docRef, customerData)
    console.log('Kunde wurde in der Datenbank gespeichert', customerData);
    this.sharedservice.changeComponents('customers');
  }



  getCostumerObject() {
    return {
      name: this.customer.name,
      street: this.customer.street,
      city: this.customer.city,
      areacode: this.customer.areacode,
      phone: this.customer.phone,
      email: this.customer.email,
      status: '',
      branch: this.customer.branch,
    }
  }
}
