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
  foundCustomer: any;
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
        console.log(customerObject);

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

  }

  findnewCustomer(data: any) {
    const searchCustomer = this.customers.find(customer => customer.email === data.email);
    if (searchCustomer) {
      console.log(searchCustomer);
      this.sharedservice.sendCustomerData(searchCustomer);
      this.sharedservice.customer = searchCustomer;
      this.foundCustomer = searchCustomer;
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

}
