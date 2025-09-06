import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule, ContactsComponent],
  templateUrl: './customerprofile.component.html',
  styleUrl: './customerprofile.component.scss'
})
export class CustomerprofileComponent {
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  customer: any;
  customerIndex: number = -1;
  currentUser: any;
  customers: any[] = [];
  isEdit: boolean = false;
  customerTemplate: string = 'dashboard';

  contacts: any[] = [];



  async ngOnInit() {
    if (this.sharedservice.customer) {
      this.customer = this.sharedservice.customer;
    } else {
      this.dataservice.getDataFromLocalStorage('customer');
      this.customer = this.dataservice.data;
    }

    if (this.sharedservice.currentUser) {
      this.currentUser = this.sharedservice.currentUser;
    } else {
      this.dataservice.getDataFromLocalStorage('user');
      this.currentUser = this.dataservice.data;
    }
    this.dataservice.getDataFromLocalStorage('customerTemplate');
    this.customerTemplate = this.dataservice.data;
    this.dataservice.loadContacts(this.currentUser.companyID, this.customer.id);
    this.dataservice.contactSubject$.subscribe((contactsData) => {
      this.contacts = contactsData;
    })

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

  saveEdit() {
    this.toggleActivateEdit();
    console.log(this.customer);
    console.log(this.currentUser);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

  }

  changeTemplate(cardKey: string) {
    console.log(cardKey);
    this.customerTemplate = cardKey;
    this.dataservice.saveDataToLocalStorage('customerTemplate', cardKey);
    // this.dataservice.customerID = this.customer.id;
    // this.dataservice.companyID = this.currentUser.companyID;

  }

  resetCuntomer() {
    this.customer = null;
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
  }

}
