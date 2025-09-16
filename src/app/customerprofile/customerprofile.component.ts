import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
import { UserService } from '../user.service';
import { CustomertasksComponent } from '../customertasks/customertasks.component';
import { Contact } from '../models/contact.class';
@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule, ContactsComponent, CustomertasksComponent],
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
  mainContact = new Contact;


  async ngOnInit() {
    console.log(this.sharedservice.isNewCustomer);

    if (this.sharedservice.isNewCustomer === true) {
      this.toggleEdit(true);
      console.log('aktiviert');

    } else {
      this.toggleEdit(false);
      console.log('deaktiviert');
    }

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
    this.dataservice.loadTasks(this.currentUser.companyID, this.customer.id);

    // this.dataservice.contactSubject$.subscribe(async (data) => {
    //   if (data) {

    //     this.mainContact = data.find((contact:any) => contact.isVIP === true);
        
        
    //   }
    // })
  }

  toggleEdit(actKey: boolean) {
    this.isEdit = actKey;
    const inputFields = document.getElementsByTagName('input');
    const textfields = document.getElementsByTagName('textarea');
    console.log(actKey);
    setTimeout(() => {
      for (let index = 0; index < inputFields.length; index++) {
        const inputield = inputFields[index];
        inputield.disabled = !actKey;

      }
      for (let index = 0; index < textfields.length; index++) {
        const textfield = textfields[index];
        textfield.disabled = !actKey;

      }
    }, 1000);


  }

  async saveEdit() {
    console.log(this.customer);
    const contactData = this.getContactData();
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    await this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);
    // await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, contactData);
    this.toggleEdit(false);


  }

  getContactData() {
    return {
      name: this.mainContact.name,
      phone: this.mainContact.phone,
      email: this.mainContact.email,
      function: this.mainContact.function,
      // customerName: this.customer?.name,
      // customerID: this.customer?.id,
      isVIP: true,
    }
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



  resetCuntomer() {
    this.customer = null;
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
  }


}
