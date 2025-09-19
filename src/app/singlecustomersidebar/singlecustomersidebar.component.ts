import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { UserService } from '../user.service';
import { Contact } from '../models/contact.class';
import { Task } from '../models/task.class';
import { takeLast } from 'rxjs';
import { UserslistComponent } from '../userslist/userslist.component';
import { update } from 'firebase/database';

@Component({
  selector: 'app-singlecustomersidebar',
  imports: [CommonModule, FormsModule, UserslistComponent],
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
  vipList: any[] = [];
  task = new Task;
  assignedUser: any;
  isMain: boolean = false;
  mainContact: any;
  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;

      } else {
        this.dataservice.getDataFromLocalStorage('user');
        this.currentUser = this.dataservice.data;
      }

    });

    this.userservice.usersSubject$.subscribe((userData) => {
      if (userData) {
        this.users = userData;
      }
    })
    this.sharedservice.customerSubject$.subscribe(async (customerObject) => {
      if (customerObject) {
        this.customer = customerObject
        // this.vipList = customerObject.favorites;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
        // this.vipList = this.customer.favorites;
      }
      if (this.currentUser && this.customer.mainContactID !== '') {
        console.log(this.customer.mainContactID);

        await this.dataservice.findMainContact(this.currentUser.companyID, this.customer.id, this.customer.mainContactID);
        this.mainContact = this.dataservice.newMainContact;
      } else {
        this.mainContact = {};
      }

    });

    this.dataservice.updatedCustomerSubject$.subscribe(async (updatedCustomer) => {
      if (updatedCustomer) {
        this.customer = updatedCustomer;
        if (this.currentUser && this.customer.mainContactID !== '') {
          console.log(this.customer.mainContactID);
          await this.dataservice.findMainContact(this.currentUser.companyID, this.customer.id, this.customer.mainContactID);
          this.mainContact = this.dataservice.newMainContact;
        } else {
          this.mainContact = {};
        }
      }
    });

    this.sharedservice.userSubject$.subscribe((userObject) => {
      if (userObject) {
        this.assignedUser = userObject;
        this.chooseEmployee();
      }
    })

  }



  async addContact() {
    const data = this.getContactData();
    await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, data);
    this.contact = this.dataservice.createdContact;
    console.log(this.contact);

    if (this.isMain) {
      this.dataservice.addMainContactToCustomer(this.currentUser.companyID, this.customer.id, this.contact.id)

    }

  }


  getContactData() {
    return {
      name: this.contact.name,
      phone: this.contact.phone,
      email: this.contact.email,
      function: this.contact.function,
      customerName: this.customer.name,
      customerID: this.customer.id,
      isVIP: false,
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

  chooseEmployee() {

    if (this.usersKey === 'outside') {
      this.customer.outsideSales = this.assignedUser;
    }
    if (this.usersKey === 'inside') {
      this.customer.insideSales = this.assignedUser;
    }
    console.log(this.customer);

    this.isOpen = false;
  }


  async addTask() {
    const task = this.getTaskObject()
    console.log(task);
    await this.dataservice.addTask(this.currentUser.companyID, task);
  }

  getTaskObject() {
    return {
      title: this.task.title,
      description: this.task.description,
      created_by: this.currentUser,
      assigned_to: this.currentUser,
      reviewer: this.task.reviewer,
      due_date: this.task.due_date,
      start_date: new Date().toISOString(),
      completed_at: '',
      updated_at: '',
      state: 'undone',
      priority: this.task.priority,
      tags: '',
      collaboraters: [],
      is_completed: false,
      blocked_by: {},
      customer: this.customer,
      comments: [],
      subtasks: [],
    }
  }










}

