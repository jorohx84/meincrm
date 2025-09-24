import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  contact: any;
  currentUser: any;
  customer: any;
  contacts: any[] = [];
  isMain: boolean = false;
  isEdit: boolean = false;
  lastContactState: any;

  constructor() {

  }
  async ngOnInit() {
    // console.log(this.sharedservice.isNewContact);

    // if (this.sharedservice.isNewContact === true) {
    //   this.toggleEdit(true);
    // } else {
    //   this.toggleEdit(false);
    // }

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


  // toggleEdit(actKey: boolean) {
  //   this.isEdit = actKey;
  //   this.dataservice.saveDataToLocalStorage('isContactEdit', actKey);
  //   if (!this.sharedservice.isNewCustomer) {
  //     this.lastContactState = structuredClone(this.contact);
  //   }



  // }

  // saveContactData() {
  //   if (this.sharedservice.isNewContact) {
  //     this.addContact();
  //   } else {
  //     this.saveEdit()
  //   }
  // }


  // async addContact() {
  //   if (this.contact.isMainContact) {
  //     await this.changeMainContact();
  //     // this.contact.isMainContact = true;
  //   }
  //   await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, this.contact);
  //   this.contact = this.dataservice.createdContact;
  //   this.dataservice.saveDataToLocalStorage('contact', this.contact);
  //   this.sharedservice.isNewContact = false;
  //   this.dataservice.saveDataToLocalStorage('isNewContact', this.sharedservice.isNewContact)
  //   this.isMain = false;
  //   this.toggleEdit(false)

  // }

  // async changeMainContact() {
  //   console.log('change');

  //   if (this.contacts.length !== 0) {
  //     const lastMainContact = this.contacts.find(contactData => contactData.isMainContact === true);
  //     if (lastMainContact) {
  //       lastMainContact.isMainContact = false;
  //       await this.dataservice.updateContact(this.currentUser.companyID, this.customer, lastMainContact)
  //     }

  //   }
  // }


  // async toggleMainContact() {
  //   // this.isMain = !this.isMain
  //   if (this.isEdit) {
  //     this.contact.isMainContact = !this.contact.isMainContact;
  //   }

    // if (!this.sharedservice.isNewContact) {
    //   this.changeMainContact();

    //   await this.dataservice.updateMainContact(this.currentUser.companyID, this.customer, this.contact, this.contact.isMainContact); // nur den Key updaten!!!
    //   this.dataservice.saveDataToLocalStorage('contact', this.contact);
    //   this.isMain = false
    // }
  

  // async saveEdit() {
  //   console.log('save');
  //   console.log(this.customer.id);

  //   // await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, contactData);
  //   // this.dataservice.saveDataToLocalStorage('customer', this.customer);
  //   await this.dataservice.updateContact(this.currentUser.companyID, this.customer, this.contact);

  //   console.log(this.contact);
  //   this.dataservice.saveDataToLocalStorage('contact', this.contact);
  //   // this.sharedservice.isNewCustomer = false;
  //   // this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
  //   this.toggleEdit(false);
  //   console.log('Änderungen wurden gesepichert', this.contact);


  // }

  // async closeEditMode() {
  //   console.log('close');
  //   if (this.sharedservice.isNewContact) {
  //     this.contact = null;
  //     this.sharedservice.isNewContact = false;
  //     this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewContact);
  //     // this.sharedservice.changeComponents('customers');
  //     this.sharedservice.changeTemplate('details');
  //   } else {
  //     this.contact = structuredClone(this.lastContactState);
  //   }
  //   this.isEdit = false;
  //   this.dataservice.saveDataToLocalStorage('isEdit', this.isEdit);

  // }


  // deleteContact() {


  // }

  // closeSingleContact() {
  //   this.contact = null;
  //   this.toggleEdit(false);
  //   this.dataservice.saveDataToLocalStorage('contact', this.contact);
  //   this.sharedservice.changeTemplate('contacts');

  // }

}