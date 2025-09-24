import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-singlecontactsidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './singlecontactsidebar.component.html',
  styleUrl: './singlecontactsidebar.component.scss'
})
export class SinglecontactsidebarComponent {
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

    });

    this.sharedservice.editContactSubject$.subscribe((state) => {
      if (state) {
        console.log(state);
        this.setContactEdit(state);
      }
    });

  }


  setContactEdit(actKey: boolean) {
    this.isEdit = actKey;
    this.dataservice.saveDataToLocalStorage('isContactEdit', actKey);
    if (!this.sharedservice.isNewCustomer) {
      this.lastContactState = structuredClone(this.contact);
    }



  }

  saveContactData() {
    if (this.sharedservice.isNewContact) {
      this.addContact();
    } else {
      this.saveEdit()
    }
  }


  async addContact() {
    if (this.contact.isMainContact) {
      await this.changeMainContact();
    }
    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, this.contact);
    this.contact = this.dataservice.createdContact;
    this.sharedservice.sendContactData(this.contact);
    this.dataservice.saveDataToLocalStorage('contact', this.contact);
    this.sharedservice.isNewContact = false;
    this.sharedservice.sendEditState(this.sharedservice.isNewContact, 'contact');
    this.dataservice.saveDataToLocalStorage('isNewContact', this.sharedservice.isNewContact)
    this.isMain = false;
    this.setContactEdit(false)

  }

  async changeMainContact() {
    console.log('change');

    if (this.contacts.length !== 0) {
      const lastMainContact = this.contacts.find(contactData => contactData.isMainContact === true);
      if (lastMainContact) {
        lastMainContact.isMainContact = false;
        await this.dataservice.updateContact(this.currentUser.companyID, this.customer, lastMainContact)
      }

    }
  }


  async toggleMainContact() {
    if (this.isEdit) {
      this.contact.isMainContact = !this.contact.isMainContact;
    }
  }

  async saveEdit() {
    console.log('save');
    await this.dataservice.updateContact(this.currentUser.companyID, this.customer, this.contact);
    this.dataservice.saveDataToLocalStorage('contact', this.contact);
    this.setContactEdit(false);
    console.log('Änderungen wurden gesepichert', this.contact);


  }

  async closeEditMode() {
    console.log('close');
    if (this.sharedservice.isNewContact) {
      console.log('isNewContact');

      this.contact = null;
      this.sharedservice.isNewContact = false;
      this.dataservice.saveDataToLocalStorage('isNewContact', this.sharedservice.isNewContact);
      this.sharedservice.sendEditState(this.sharedservice.isNewContact, 'contact');
      this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewContact);
      // this.sharedservice.changeComponents('customers');
      this.sharedservice.changeTemplate('details');

    } else {
      this.contact = structuredClone(this.lastContactState);
    }
    this.setContactEdit(false);

  }


  deleteContact() {
    console.log(this.contact);
    this.sharedservice.sendContactData(this.contact);
    this.sharedservice.sendCustomerData(this.customer);
    this.sharedservice.confirmationOpen = true;
    this.sharedservice.toDelete = 'contact';
  }

  closeSingleContact() {
    this.contact = null;
    this.dataservice.saveDataToLocalStorage('contact', this.contact);
    this.sharedservice.changeTemplate('contacts');

  }
}


