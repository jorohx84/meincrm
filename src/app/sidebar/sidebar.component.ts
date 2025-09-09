import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../models/user.class';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { Customer } from '../models/customer.class';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sharedservice = inject(SharedService)
  userservice = inject(UserService);
  dataservice = inject(DataService);
  currentUser: any;
  users: any[] = [];
  customer: any;
  newCostumer = new Customer;
  isEdit: boolean = false;
  customers: any[] = [];
  contact = new Contact;
  timer: any;
  currentTime: string = '';
  constructor() {
    this.sharedservice.isLogin = false;
    console.log(this.sharedservice.isLogin);
    // this.currentUser = this.userservice.currentUser;



  }


  async ngOnInit() {
    this.loadComponent();
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);

      }

    })

    this.dataservice.customersSubject$.subscribe((customersData) => {
      if (customersData) {
        this.customers = customersData;

      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
    })

    this.userservice.usersSubject$.subscribe((allUsers) => {
      if (allUsers) {
        this.users = allUsers;
        console.log(this.users);

      }
    })


    this.sharedservice.customerSubject$.subscribe((customerObject) => {
      if (customerObject) {
        this.customer = customerObject
        console.log(this.customer);


      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
    })
  }

  loadComponent() {
    this.dataservice.getDataFromLocalStorage('component');
    this.sharedservice.component = this.dataservice.data;
    console.log(this.sharedservice.component);

  }

  async addCustomer() {
    const data = this.getCostumerObject();
    await this.dataservice.addCustomer(this.currentUser.companyID, data);
    this.customer = this.findnewCustomer(data);
    this.newCostumer.name = '';
    this.newCostumer.street = '';
    this.newCostumer.city = '';
    this.newCostumer.phone = '';
    this.newCostumer.email = '';
    this.newCostumer.branch = '';


  }

  findnewCustomer(data: any) {
    const searchCustomer = this.customers.find(customer => customer.email === data.email);
    if (searchCustomer) {
      console.log(searchCustomer);
      this.sharedservice.sendCustomerData(searchCustomer);
      this.sharedservice.customer = searchCustomer;
      this.dataservice.saveDataToLocalStorage('customer', searchCustomer);
      this.sharedservice.changeComponents('customer');

    }

  }


  getCostumerObject() {
    return {
      name: this.newCostumer.name,
      street: this.newCostumer.street,
      city: this.newCostumer.city,
      areacode: this.newCostumer.areacode,
      phone: this.newCostumer.phone,
      email: this.newCostumer.email,
      status: '',
      branch: this.newCostumer.branch,
      createdBy: this.currentUser.name
    }

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

    toggleActivateEdit() {
    const fields = document.getElementsByTagName('input');
    console.log(fields);
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      field.disabled = !field.disabled;

    }
    this.isEdit = !this.isEdit;
  }

  async deleteCustomer() {
    await this.dataservice.deleteCustomer(this.currentUser.companyID, this.customer.id);
    this.sharedservice.changeComponents('customers');
  }

    saveEdit() {
    this.toggleActivateEdit();
    console.log(this.customer);
    console.log(this.currentUser);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

  }

}
