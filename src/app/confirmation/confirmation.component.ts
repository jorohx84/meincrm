import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { update } from 'firebase/database';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  dataservice = inject(DataService);
  sharedservcice = inject(SharedService);
  userservice = inject(UserService);
  customer: any;
  user: any;
  ngOnInit() {
    this.userservice.currentUser$.subscribe((userData) => {
      if (userData) {
        this.user = userData;
      }
    })
    this.sharedservcice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
        console.log(this.customer);

      }
    });
    this.dataservice.updatedCustomerSubject$.subscribe((updatedCustomer)=>{
      if (updatedCustomer) {
        this.customer=updatedCustomer;
      }
    });
    // this.dataservice.contactSubject$.subscribe((contactData)=>{
    //   if (contactData) {
    //     con
    //   }
    // });


  }


  async deleteCustomerData() {
    console.log(this.customer);
    console.log(this.user);

    await this.dataservice.deleteCustomer(this.user.companyID, this.customer.id);
    this.sharedservcice.confirmationOpen = false;
    this.sharedservcice.changeComponents('customers');
  }

  quitDelete() {
    this.sharedservcice.confirmationOpen = false;
  }


}
