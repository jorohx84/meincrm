import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { UserService } from '../user.service';
import { Contact } from '../models/contact.class';
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
  contact = new Contact;

  async ngOnInit(){
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;

      }

    });
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
    const fields = document.getElementsByTagName('input');
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      field.disabled = !field.disabled;

    }
    this.isEdit = !this.isEdit;
  }

  saveEdit() {
    this.toggleActivateEdit();
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

  }
}
