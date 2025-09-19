import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';
import { Customer } from '../models/customer.class';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { UserslistComponent } from '../userslist/userslist.component';


@Component({
  selector: 'app-customerssidebar',
  imports: [CommonModule, FormsModule, UserslistComponent],
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
  employeeKey: string = '';
  assignedUser: any;

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

    // this.sharedservice.userSubject$.subscribe((userObject) => {
    //   if (userObject) {
    //     this.assignedUser = userObject;
    //     console.log(this.assignedUser);
    //     this.chooseEmployee();

    //   }
    // })

  }
  async openCustomerTemplate() {
    console.log('add');

    const data = this.getCostumerObject();

    this.sharedservice.isNewCustomer = true;
    this.sharedservice.changeComponents('customer');
    this.sharedservice.changeTemplate('details');
    this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
    // await this.dataservice.addCustomer(this.currentUser.companyID, data);
    // this.customer = this.dataservice.newCustomer;

    this.dataservice.saveDataToLocalStorage('customer', data);
    this.sharedservice.sendCustomerData(data);


    // this.newCostumer.name = '';
    // this.newCostumer.street = '';
    // this.newCostumer.city = '';
    // this.newCostumer.phone = '';
    // this.newCostumer.email = '';
    // this.newCostumer.branch = '';

  }

  getCostumerObject() {
    return {
      name: '',
      street: '',
      city: '',
      areacode: '',
      phone: '',
      email: '',
      status: '',
      branch: '',
      createdBy: {
        name: this.currentUser.name,
        id: this.currentUser.id,
      },
      mainContactID: '',
      outsideSales: '',
      insideSales: '',
      favorites: [],
      description: '',
    }

  }


  chooseEmployee() {

    if (this.employeeKey === 'outside') {
      this.newCostumer.outsideSales = this.assignedUser;
    }
    if (this.employeeKey === 'inside') {
      this.newCostumer.insideSales = this.assignedUser;
    }
    console.log(this.newCostumer.outsideSales);
    console.log(this.newCostumer.insideSales);
    this.sharedservice.userListOpen = false;
  }


  openUserList(key: string) {
    this.sharedservice.userListOpen = true;
    this.employeeKey = key;
  }
}
