import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule],
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
  ngOnInit() {
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

  }

  toggleActivateEdit() {
    const fields = document.getElementsByTagName('input');
    console.log(fields);
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      field.disabled = !field.disabled;

    }
  }

  saveEdit() {
    this.toggleActivateEdit();
    console.log(this.customer);
    console.log(this.currentUser);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer)
  }
}
