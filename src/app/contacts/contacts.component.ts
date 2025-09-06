import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { SharedService } from '../shared.service';
@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  contacts: any[] = [];
  contact: any = new Contact;
  customer: any;
  currentUser: any;
  ngOnInit() {
    this.dataservice.contactSubject$.subscribe((contactsData) => {
      if (contactsData) {
        this.contacts = contactsData
      }

    });
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


  }


  async addContact() {
    const data = {
      name: this.contact.name,
      phone: this.contact.phone,
      email: this.contact.email,
      function: this.contact.function,

    }
    console.log(data);
    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);
    this.contact.name = '';
    this.contact.phone = '';
    this.contact.email = '';
    this.contact.function = '';

  }
}
