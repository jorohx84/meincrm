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
import { SinglecontactComponent } from '../singlecontact/singlecontact.component';

@Component({
  selector: 'app-singlecustomer',
  imports: [CommonModule, FormsModule, ContactsComponent, CustomertasksComponent, ConfirmationComponent, SinglecontactComponent],
  templateUrl: './singlecustomer.component.html',
  styleUrl: './singlecustomer.component.scss'
})
export class SinglecustomerComponent {
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
    // if (this.sharedservice.isNewCustomer === true) {
    //   console.log(this.sharedservice.isNewCustomer);

    //   this.toggleEdit(true);
    // } else {
    //   this.toggleEdit(false);
    // }

    this.sharedservice.customerSubject$.subscribe((customerData) => {
      if (customerData) {
        this.customer = customerData;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;

      }

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

    this.dataservice.contactsSubject$.subscribe(async (contactData) => {
      if (contactData) {
        this.contacts = contactData;
        this.dataservice.loadMainContact(this.currentUser.companyID, this.customer.id, this.contacts);
        this.mainContact = this.dataservice.newMainContact;
      }
    })



    // this.dataservice.contactSubject$.subscribe(async (data) => {
    //   if (data) {

    //     this.mainContact = data.find((contact:any) => contact.isVIP === true);


    //   }
    // })
  }


  openSingleContactTemplate() {
    const data = this.getContactData();
    this.sharedservice.isNewContact = true;
    this.sharedservice.isSlide = false;
    this.sharedservice.sendEditState(this.sharedservice.isNewContact, 'contact');
    this.dataservice.saveDataToLocalStorage('isSlide', this.sharedservice.isSlide);
    this.dataservice.saveDataToLocalStorage('isNewContact', this.sharedservice.isNewContact);
    this.sharedservice.changeTemplate('singleContact');
    this.sharedservice.sendContactData(data);
    this.dataservice.saveDataToLocalStorage('contact', data);

  }

  getContactData() {
    return {
      name: '',
      phone: '',
      email: '',
      function: '',
      customerName: this.customer.name,
      customerID: this.customer.id,
      isVIP: false,
      isMainContact: false,
      notes: '',
    }
  }



  // toggleEdit(actKey: boolean) {
  //   this.isEdit = actKey;
  //   this.dataservice.saveDataToLocalStorage('isEdit', actKey);
  //   if (!this.sharedservice.isNewCustomer) {
  //     this.lastCustomerState = structuredClone(this.customer);
  //   }
  // }


  // async saveNotes() {
  //   await this.dataservice.updateNotes(this.currentUser.companyID, this.customer.id, this.customer.notes);
  //   this.dataservice.saveDataToLocalStorage('customer', this.customer);

  // }


  // async saveCustomerData() {
  //   if (this.sharedservice.isNewCustomer) {
  //     await this.addCustomer();
  //   } else {
  //     await this.saveEdit();
  //   }
  // }

  // async addCustomer() {
  //   await this.dataservice.addCustomer(this.currentUser.companyID, this.customer);
  //   this.customer = this.dataservice.newCustomer;
  //   this.dataservice.saveDataToLocalStorage('customer', this.customer);
  //   this.sharedservice.sendCustomerData(this.customer);
  //   this.sharedservice.isNewCustomer = false;
  //   this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
  //   this.toggleEdit(false);
  //   console.log('Kunde wurde angelegt', this.customer);
  // }



  // async saveEdit() {
  //   await this.dataservice.updateCustomer(this.currentUser.companyID, this.customer.id, this.customer);
  //   console.log(this.customer);
  //   this.dataservice.saveDataToLocalStorage('customer', this.customer);
  //   this.toggleEdit(false);
  //   console.log('Änderungen wurden gesepichert', this.customer);


  // }




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

  // resetCustomer() {
  //   this.customer = null;
  //   this.toggleEdit(false);

  //   this.dataservice.saveDataToLocalStorage('customer', this.customer);
  // }

  // quitAddCustomer() {
  //   console.log('quit');
  //   
  //   this.isEdit = false;
  //   this.dataservice.saveDataToLocalStorage('isEdit', this.isEdit);
  //   this.sharedservice.isNewCustomer = false;
  //   this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);

  // }

  // async closeEditMode() {
  //   if (this.sharedservice.isNewCustomer) {
  //     this.customer = null;
  //     this.sharedservice.isNewCustomer = false;
  //     this.dataservice.saveDataToLocalStorage('isNewCustomer', this.sharedservice.isNewCustomer);
  //     this.sharedservice.changeComponents('customers');
  //     this.sharedservice.changeTemplate('details');
  //   } else {
  //     this.customer = structuredClone(this.lastCustomerState);
  //   }
  //   this.isEdit = false;
  //   this.dataservice.saveDataToLocalStorage('isEdit', this.isEdit);

  // }

  // deleteCustomer() {
  //   this.sharedservice.sendCustomerData(this.customer);
  //   this.sharedservice.confirmationOpen = true;
  // }

  // closeSingleContact() {
  //   this.sharedservice.changeTemplate('contacts');
  // }


  closeCustomerTemplates() {
    if (this.sharedservice.customerTemplate === 'singleContact') {
      this.sharedservice.changeTemplate('contacts');

    } else if (this.sharedservice.customerTemplate !== 'singleContact') {
      this.sharedservice.changeTemplate('details');
      this.sharedservice.changeComponents('customers');

    }
  }


}

