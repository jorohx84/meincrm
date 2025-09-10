import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
import { UserService } from '../user.service';
import { TasksComponent } from '../tasks/tasks.component';
@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule, ContactsComponent, TasksComponent],
  templateUrl: './customerprofile.component.html',
  styleUrl: './customerprofile.component.scss'
})
export class CustomerprofileComponent {
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  userservice = inject(UserService);
  customer: any;
  customerIndex: number = -1;
  currentUser: any;
  customers: any[] = [];
  isEdit: boolean = false;
  customerTemplate: string = '';
  contacts: any[] = [];



  async ngOnInit() {

    this.sharedservice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
    })


    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.dataservice.getDataFromLocalStorage('user');
        this.currentUser = this.dataservice.data;
      }
    });

    this.dataservice.getDataFromLocalStorage('customerTemplate');
    this.sharedservice.customerTemplate = this.dataservice.data;
    this.dataservice.loadContacts(this.currentUser.companyID, this.customer.id);

  }

  // toggleActivateEdit() {
  //   const fields = document.getElementsByTagName('input');
  //   console.log(fields);
  //   for (let index = 0; index < fields.length; index++) {
  //     const field = fields[index];
  //     field.disabled = !field.disabled;

  //   }
  //   this.isEdit = !this.isEdit;
  // }

  // saveEdit() {
  //   this.toggleActivateEdit();
  //   console.log(this.customer);
  //   console.log(this.currentUser);
  //   this.dataservice.saveDataToLocalStorage('customer', this.customer);
  //   this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

  // }

  changeTemplate(cardKey: string) {
    this.sharedservice.customerTemplate = cardKey;
    this.dataservice.saveDataToLocalStorage('customerTemplate', cardKey);
    // this.dataservice.customerID = this.customer.id;
    // this.dataservice.companyID = this.currentUser.companyID;

  }

  resetCuntomer() {
    this.customer = null;
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
  }

 
}
