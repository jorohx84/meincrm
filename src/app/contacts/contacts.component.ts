import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  contacts: any[] = [];
  contact: any = new Contact;
  editedContact = new Contact;
  customer: any;
  currentUser: any;
  isEdit: boolean = false;
  editIndex: number | null = null;
  ngOnInit() {
    this.dataservice.contactSubject$.subscribe((contactsData) => {
      if (contactsData) {
        this.contacts = contactsData
        console.log(this.contacts);
        this.sortList();
      }

    });
    if (this.sharedservice.customer) {
      this.customer = this.sharedservice.customer;
    } else {
      this.dataservice.getDataFromLocalStorage('customer');
      this.customer = this.dataservice.data;
    }

    // if (this.sharedservice.currentUser) {
    //   this.currentUser = this.sharedservice.currentUser;
    // } else {
    //   this.dataservice.getDataFromLocalStorage('user');
    //   this.currentUser = this.dataservice.data;
    // }

    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
      }
    });
  }

  sortList() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }


  // async addContact() {
  //   const data = {
  //     name: this.contact.name,
  //     phone: this.contact.phone,
  //     email: this.contact.email,
  //     function: this.contact.function,
  //     customerName: this.customer.name,
  //     customerID: this.customer.id,

  //   }

  //   console.log(data);
  //   await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);
  //   this.contact.name = '';
  //   this.contact.phone = '';
  //   this.contact.email = '';
  //   this.contact.function = '';

  // }

  async editContact(index: number) {
    console.log(index);
    this.isEdit = true;
    this.editIndex = index;
    this.editedContact = this.contacts[index];

  }

  async saveEdit() {


    console.log(this.editedContact);
    this.isEdit = false;

this.dataservice.updateContact(this.currentUser.companyID, this.customer.id, this.editedContact.id, this.editedContact)

  }
}


