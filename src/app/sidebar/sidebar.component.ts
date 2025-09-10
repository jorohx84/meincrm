import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../models/user.class';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';
import { Customer } from '../models/customer.class';
import { CustomerssidebarComponent } from '../customerssidebar/customerssidebar.component';
import { SinglecustomersidebarComponent } from '../singlecustomersidebar/singlecustomersidebar.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule, CustomerssidebarComponent, SinglecustomersidebarComponent],
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


  customers: any[] = [];


  constructor() {
    this.sharedservice.isLogin = false;
    // this.currentUser = this.userservice.currentUser;
    this.loadComponent();

  }


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;

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
      }
    })


 
  }

  loadComponent() {
    this.dataservice.getDataFromLocalStorage('component');
    this.sharedservice.component = this.dataservice.data;
  }






 
}
