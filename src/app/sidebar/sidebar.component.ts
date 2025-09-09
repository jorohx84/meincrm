import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../models/user.class';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact.class';

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
  customer: any;
  contact = new Contact;
  timer: any;
  currentTime: string = '';
  constructor() {
    this.sharedservice.isLogin = false;
    console.log(this.sharedservice.isLogin);
    // this.currentUser = this.userservice.currentUser;

    this.loadComponent();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1);
  }


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);

      }

    })
    // if (this.sharedservice.customer) {
    //   this.customer = this.sharedservice.customer
    // } else {

    // }

    this.sharedservice.customerSubject$.subscribe((customerObject) => {
      if (customerObject) {
        this.customer = customerObject
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

  updateTime() {
    const now = new Date();
    this.currentTime = now.toISOString();
  }


  async addContact() {
    const data = {
      name: this.contact.name,
      phone: this.contact.phone,
      email: this.contact.email,
      function: this.contact.function,
      customerName: this.customer.name,
      customerID: this.customer.id,

    }

    console.log(data);
    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);
    // this.contact.name = '';
    // this.contact.phone = '';
    // this.contact.email = '';
    // this.contact.function = '';

  }


}
