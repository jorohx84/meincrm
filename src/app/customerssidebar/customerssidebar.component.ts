import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';
import { Customer } from '../models/customer.class';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-customerssidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './customerssidebar.component.html',
  styleUrl: './customerssidebar.component.scss'
})
export class CustomerssidebarComponent {
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  customer: any;
  customers: any[] = [];
  currentUser: any;
  users: any[] = [];
  newCostumer = new Customer;
  employee: any;
  userListOpen: boolean = false;
  employeeKey: string = '';


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.userservice.usersSubject$.subscribe((allUsers) => {
      if (allUsers) {
        this.users = allUsers;
      }
    })
    this.dataservice.customersSubject$.subscribe((customersData) => {
      if (customersData) {
        this.customers = customersData;
      }
    })

  }
  async addCustomer() {
    const data = this.getCostumerObject();
    await this.dataservice.addCustomer(this.currentUser.companyID, data);
    this.customer = this.dataservice.newCustomer;

    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.sharedservice.sendCustomerData(this.customer);
    this.sharedservice.changeComponents('customer');


    this.newCostumer.name = '';
    this.newCostumer.street = '';
    this.newCostumer.city = '';
    this.newCostumer.phone = '';
    this.newCostumer.email = '';
    this.newCostumer.branch = '';
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
      createdBy: this.currentUser.name,
      outsideSales: this.newCostumer.outsideSales,
      insideSales: this.newCostumer.insideSales,
      favorites: [],
    }

  }


  chooseEmployee(index: number) {
    this.employee = this.users[index];
    if (this.employeeKey === 'outside') {
      this.newCostumer.outsideSales = this.employee;
    }
    if (this.employeeKey === 'inside') {
      this.newCostumer.insideSales = this.employee;
    }
    this.userListOpen = false;
  }

  openUserList(key: string) {
    this.userListOpen = true;
    this.employeeKey = key;
  }
}
