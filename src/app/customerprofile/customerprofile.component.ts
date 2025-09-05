import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule],
  templateUrl: './customerprofile.component.html',
  styleUrl: './customerprofile.component.scss'
})
export class CustomerprofileComponent {
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  customer: any;
  customerIndex: number = -1;
  currentUser: any;
  customers: any[] = [];
  isEdit: boolean = false;
  template: string = 'dashboard';
  contact: any = new Contact;
  contacts: any[] = [];



  async ngOnInit() {
    if (this.sharedservice.customer) {
      this.customer = this.sharedservice.customer;
    } else {
      this.dataservice.getDataFromLocalStorage('customer');
      this.customer = this.dataservice.data;
    }

    if (this.sharedservice.currentUser) {
      this.currentUser = this.sharedservice.currentUser;
    } else {
      this.dataservice.getDataFromLocalStorage('user');
      this.currentUser = this.dataservice.data;
    }
    this.dataservice.getDataFromLocalStorage('template');
    this.template = this.dataservice.data;
    this.dataservice.loadContacts(this.currentUser.companyID, this.customer.id);
    this.dataservice.contactSubject$.subscribe((contactsData) => {
      this.contacts = contactsData;
    })

  }

  toggleActivateEdit() {
    const fields = document.getElementsByTagName('input');
    console.log(fields);
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      field.disabled = !field.disabled;

    }
    this.isEdit = !this.isEdit;
  }

  saveEdit() {
    this.toggleActivateEdit();
    console.log(this.customer);
    console.log(this.currentUser);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

  }

  openCard(cardKey: string) {
    console.log(cardKey);
    this.template = cardKey;
    this.dataservice.saveDataToLocalStorage('template', cardKey);
    // this.dataservice.customerID = this.customer.id;
    // this.dataservice.companyID = this.currentUser.companyID;

  }

  addContact() {
    const data = {
      name: this.contact.name,
      phone: this.contact.phone,
      email: this.contact.email,
      function: this.contact.function,

    }
    console.log(data);
    this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);
  }
}
