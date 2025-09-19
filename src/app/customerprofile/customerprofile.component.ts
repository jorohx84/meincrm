import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
import { UserService } from '../user.service';
import { CustomertasksComponent } from '../customertasks/customertasks.component';
import { Contact } from '../models/contact.class';
import { object } from '@angular/fire/database';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule, FormsModule, ContactsComponent, CustomertasksComponent, ConfirmationComponent],
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
  mainContact = {
    name: '',
    function: '',
    phone: '',
    email: '',
  };
  isValid: boolean = false;
  lastCustomerState: any;

  async ngOnInit() {
    if (this.sharedservice.isNewCustomer === true) {
      this.toggleEdit(true);
    } else {
      this.toggleEdit(false);
    }

    this.sharedservice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;

      }
      // if (this.customer.mainContact) {
      //   this.mainContact = this.customer.mainContact
      // }

      console.log(this.customer);

    })

    this.dataservice.updatedCustomerSubject$.subscribe((updatedCustomer) => {
      if (updatedCustomer) {
        this.customer = updatedCustomer
        this.dataservice.saveDataToLocalStorage('customer', updatedCustomer);
      }
    });


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
    // if (!this.sharedservice.isNewCustomer) {
    //   this.mainContact = this.customer.mainContact

    // }

    this.dataservice.contactSubject$.subscribe(async (contactData) => {
      if (contactData) {
        this.contacts = contactData;
      }
    })



    // this.dataservice.contactSubject$.subscribe(async (data) => {
    //   if (data) {

    //     this.mainContact = data.find((contact:any) => contact.isVIP === true);


    //   }
    // })
  }

  toggleEdit(actKey: boolean) {
    this.isEdit = actKey;
    this.dataservice.saveDataToLocalStorage('isEdit', actKey);
    if (!this.sharedservice.isNewCustomer) {
      this.lastCustomerState = structuredClone(this.customer);
    }



  }


  async saveNotes() {

    await this.dataservice.updateNotes(this.currentUser.companyID, this.customer.id, this.customer.notes);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    console.log(this.customer);

  }


  validateInputFields() {
    if (this.customer.name === '' || this.customer.branch === '' || this.customer.street === '' || this.customer.areacode === '' || this.customer.ctiy === '') {

      this.isValid = false;
    } else {
      this.isValid = true;
    }


  }

  async saveCustomerData() {
    if (this.sharedservice.isNewCustomer) {
      await this.addCustomer();
    } else {
      await this.saveEdit();
    }
  }

  async addCustomer() {


    console.log(this.customer);
    await this.dataservice.addCustomer(this.currentUser.companyID, this.customer);
    this.customer = this.dataservice.newCustomer;
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    this.sharedservice.sendCustomerData(this.customer);
    this.sharedservice.isNewCustomer = false;
    this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
    this.toggleEdit(false);
    console.log('Kunde wurde angelegt', this.customer);
    // console.log('add');
    // await this.dataservice.addCustomer(this.currentUser.companyID, this.customer);
    // const newID = this.dataservice.newCustomer.id;
    // const contactData = this.getContactData();
    // await this.dataservice.addMainContact(this.currentUser.companyID, newID, contactData);
    // await this.dataservice.addMainContactToCustomer(this.currentUser.companyID, newID, this.dataservice.newMainContact);
    // this.customer = this.dataservice.newCustomer;
    // this.dataservice.loadContacts(this.currentUser.companyID, newID);
    // this.dataservice.saveDataToLocalStorage('customer', this.customer);
    // console.log('Neuer Kunde hinzugefügt', this.customer);
    // this.sharedservice.isNewCustomer = false;
    // this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
    // this.toggleEdit(false);
  }



  async saveEdit() {
    console.log('save');

    // await this.dataservice.addContact(this.currentUser.companyID, this.customer.id, contactData);
    // this.dataservice.saveDataToLocalStorage('customer', this.customer);
    await this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);

    console.log(this.customer);
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
    // this.sharedservice.isNewCustomer = false;
    // this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
    this.toggleEdit(false);
    console.log('Änderungen wurden gesepichert', this.customer);


  }




  // getContactData() {
  //   return {
  //     name: this.mainContact.name,
  //     phone: this.mainContact.phone,
  //     email: this.mainContact.email,
  //     function: this.mainContact.function,
  //     customerName: this.dataservice.newCustomer?.name,
  //     customerID: this.dataservice.newCustomer.id,
  //     isVIP: true,
  //     isMainContact: true,
  //   }
  // }

  resetCuntomer() {
    this.customer = null;
    this.dataservice.saveDataToLocalStorage('customer', this.customer);
  }

  // quitAddCustomer() {
  //   console.log('quit');
  //   
  //   this.isEdit = false;
  //   this.dataservice.saveDataToLocalStorage('isEdit', this.isEdit);
  //   this.sharedservice.isNewCustomer = false;
  //   this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);

  // }

  async closeEditMode() {
    console.log('close');
    if (this.sharedservice.isNewCustomer) {
      this.customer = null;
      this.sharedservice.isNewCustomer = false;
      this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
      this.sharedservice.changeComponents('customers');
      this.sharedservice.changeTemplate('details');
    } else {
      this.customer = structuredClone(this.lastCustomerState);
    }
    this.isEdit = false;
    this.dataservice.saveDataToLocalStorage('isEdit', this.isEdit);

  }

  deleteCustomer() {
    this.sharedservice.sendCustomerData(this.customer);
    this.sharedservice.confirmationOpen = true;
  }
}
