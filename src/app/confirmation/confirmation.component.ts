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
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  customer: any;
  user: any;
  contact: any;
  ngOnInit() {
    this.userservice.currentUser$.subscribe((userData) => {
      if (userData) {
        this.user = userData;
      }
    })
    this.sharedservice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
        console.log(this.customer);

      }
    });
    this.dataservice.updatedCustomerSubject$.subscribe((updatedCustomer) => {
      if (updatedCustomer) {
        this.customer = updatedCustomer;
      }

      this.sharedservice.contactSubject$.subscribe((contactData) => {
        if (contactData) {
          this.contact = contactData;
          console.log(this.contact);
        }
      });
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
    this.sharedservice.confirmationOpen = false;
    this.sharedservice.changeComponents('customers');
  }
  async deleteContact() {
    console.log(this.user, this.customer, this.contact );
    
    await this.dataservice.deleteContact(this.user.companyID, this.customer, this.contact);
    this.sharedservice.changeTemplate('contacts');
     this.sharedservice.confirmationOpen = false;
  }

  quitDelete() {
    this.sharedservice.confirmationOpen = false;
  }


}
