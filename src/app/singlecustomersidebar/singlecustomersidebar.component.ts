import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { UserService } from '../user.service';
import { Contact } from '../models/contact.class';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-singlecustomersidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './singlecustomersidebar.component.html',
  styleUrl: './singlecustomersidebar.component.scss'
})
export class SinglecustomersidebarComponent {
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  dataservice = inject(DataService);
  currentUser: any;
  customer: any;
  isEdit: boolean = false;
  isOpen: boolean = false;
  contact = new Contact;
  users: any[] = [];
  usersKey: string = '';
  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;

      }

    });

    this.userservice.usersSubject$.subscribe((userData) => {
      if (userData) {
        this.users = userData;
      }
    })
    this.sharedservice.customerSubject$.subscribe((customerObject) => {
      if (customerObject) {
        this.customer = customerObject
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
    })
  }
  async addContact() {
    const data = this.getContactData();
    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);

  }


  getContactData() {
    return {
      name: this.contact.name,
      phone: this.contact.phone,
      email: this.contact.email,
      function: this.contact.function,
      customerName: this.customer.name,
      customerID: this.customer.id,
    }
  }


  async deleteCustomer() {
    console.log(this.currentUser, this.customer);

    await this.dataservice.deleteCustomer(this.currentUser.companyID, this.customer.id);
    this.sharedservice.changeComponents('customers');
  }



  toggleActivateEdit() {
    this.isEdit = !this.isEdit;
  }

  openUserList(key: string) {
    this.usersKey = key;
    this.isOpen = true;
    console.log(this.usersKey);

  }

  saveEdit() {
    console.log(this.customer);
    this.isOpen = false;


    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);
    this.toggleActivateEdit();
  }

  chooseEmployee(index: number) {
    const employee = this.users[index];
    if (this.usersKey === 'outside') {
      this.customer.outsideSales = employee;
    }
    if (this.usersKey === 'inside') {
      this.customer.insideSales = employee;
    }
    console.log(this.customer);

    this.isOpen = false;
  }
}
