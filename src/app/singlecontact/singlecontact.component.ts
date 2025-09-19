import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-singlecontact',
  imports: [CommonModule, FormsModule],
  templateUrl: './singlecontact.component.html',
  styleUrl: './singlecontact.component.scss'
})
export class SinglecontactComponent {
  userservice = inject(UserService);
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  contact = new Contact;
  currentUser: any;
  customer: any;
  contacts: any[] = [];
  isMain: boolean = false;
  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;

      } else {
        this.dataservice.getDataFromLocalStorage('user');
        this.currentUser = this.dataservice.data;
      }

    });
    this.sharedservice.customerSubject$.subscribe(async (customerObject) => {
      if (customerObject) {
        this.customer = customerObject
        console.log(this.customer);

      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;

      }
      console.log(this.customer);


    });

    this.dataservice.contactsSubject$.subscribe(async (contactsList) => {
      if (contactsList) {
        this.contacts = contactsList;
        console.log(this.contacts);


      }
    });

    this.sharedservice.contactSubject$.subscribe((contactData) => {
      if (contactData) {
        this.contact = contactData;
      } else {
        this.dataservice.getDataFromLocalStorage('contact');
        this.contact = this.dataservice.data;
      }
      console.log(this.contact);

    })

  }

  async addContact() {
    if (this.isMain) {
      await this.changeMainContact();
      this.contact.isMainContact = true;
    }
    console.log(this.customer);
    console.log(this.currentUser);
    console.log(this.contact);


    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, this.contact);
    this.contact = this.dataservice.createdContact;
    this.dataservice.saveDataToLocalStorage('contact', this.contact);
    this.isMain = false;

  }

  async changeMainContact() {
    if (this.contacts.length !== 0) {
      const lastMainContact = this.contacts.find(contactData => contactData.isMainContact === true);
      if (lastMainContact) {
        lastMainContact.isMainContact = false;
        await this.dataservice.updateContact(this.currentUser.companyID, this.customer, lastMainContact.id, lastMainContact)
      }

    }
  }


}
