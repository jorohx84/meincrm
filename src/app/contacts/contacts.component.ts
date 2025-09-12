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
  customers: any[] = [];
  currentUser: any;
  isEdit: boolean = false;
  editIndex: number | null = null;

  ngOnInit() {
    this.dataservice.contactSubject$.subscribe((contactsData) => {
      if (contactsData) {
        this.contacts = contactsData
        this.sortList();
      }

    });

    this.sharedservice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
      console.log(this.customer);

    })


    // if (this.sharedservice.currentUser) {
    //   this.currentUser = this.sharedservice.currentUser;
    // } else {
    //   this.dataservice.getDataFromLocalStorage('user');
    //   this.currentUser = this.dataservice.data;
    // }

    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
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
    this.isEdit = true;
    this.editIndex = index;
    this.editedContact = this.contacts[index];

  }

  async deleteContact(index: number) {
    const contactToDelete = this.contacts[index];
    console.log(contactToDelete.id);
    await this.dataservice.deleteContact(this.currentUser.companyID, this.customer.id, contactToDelete);
  }

  async saveEdit() {
    this.isEdit = false;

    this.dataservice.updateContact(this.currentUser.companyID, this.customer.id, this.editedContact.id, this.editedContact)

  }

  async changeToFavorites(index: number, changeKey: string) {
    const vip = this.contacts[index];
    const vipList = this.customer.favorites;
    let vipState: boolean = false;
    if (changeKey === 'add') {
      vipList.push(vip);
      vipState = true;
    }
    if (changeKey === 'remove') {
      const deleteIndex = this.customer.favorites.findIndex((data: any) => data.id === vip.id)
      vipList.splice(deleteIndex, 1);
      vipState = false;
    }


    await this.dataservice.addFavoritesToCustomer(this.currentUser.companyID, this.customer.id, vipList);
    this.dataservice.updateVipStatus(this.currentUser.companyID, this.customer.id, vip.id, vipState);



    this.sharedservice.sendCustomerData(this.customer);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);


  }




}




