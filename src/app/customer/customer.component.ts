import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { SharedService } from '../shared.service';
import { collection } from 'firebase/firestore';
import { DataService } from '../data.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Customer } from '../models/customer.class';


@Component({
  selector: 'app-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  userservice = inject(UserService);
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  currentUser: any;
  customer: any | null = null
  customers: any[] = [];
  allCustomers: any[] = [];
  searchFilterOpen: boolean = false;
  // searchFilters: any[] = [];
  headlines: any[] = [];
  searchValue: string = '';
  isloading: boolean = true;
  isFound: boolean = false;
  isSearch: boolean = false;
  isSortUp: boolean = false;
  isSortDown: boolean = false;
  toggle: boolean = false;
  activeSortIndex: number | null = null;
  sortDirections: { [index: number]: 'asc' | 'desc' } = {};

  customerFields = [  //hier werden die felder der Tabelle hinzugefügt!!!!!
    { fieldName: 'name', displayName: 'Name' },
    { fieldName: 'street', displayName: 'Straße' },
    { fieldName: 'city', displayName: 'Stadt' },
    { fieldName: 'areacode', displayName: 'Postleitzahl' },
    { fieldName: 'phone', displayName: 'Telefon' },
    { fieldName: 'email', displayName: 'E-Mail' },
    { fieldName: 'branch', displayName: 'Branche' },

  ];

  currentSearchFilter: any = this.customerFields[0];

  async ngOnInit() {
    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.dataservice.customersSubject$.subscribe((customers) => {
      if (customers) {
        this.customers = customers;
        this.allCustomers = customers;
        this.isloading = false;
      }

    })

  }


  isBackground(index: number) {
    return index % 2 === 0;
  }


  openFilter() {
    this.searchFilterOpen = !this.searchFilterOpen;
  }

  changeSearchFitler(index: number) {
    this.currentSearchFilter = this.customerFields[index];
  }

  searchCustomer() {
    if (this.searchValue.length > 0) {
      this.isSearch = true
      const key: keyof Customer = this.currentSearchFilter.fieldName as keyof Customer;
      const searchedCustomers: any[] = [];
      for (let index = 0; index < this.allCustomers.length; index++) {
        const customer = this.allCustomers[index];
        if (customer[key].toLowerCase().includes(this.searchValue.toLowerCase())) {
          searchedCustomers.push(customer);
        }
      }
      this.isFound = searchedCustomers.length > 0 ? true : false;
      this.customers = searchedCustomers;
    } else {
      this.customers = this.allCustomers;
      this.isSearch = false;
    }
  }

  sortList(fieldName: string, iconIndex: number) {
    this.activeSortIndex = iconIndex;
    if (this.sortDirections[iconIndex] === 'asc') {
      this.sortDirections[iconIndex] = 'desc';
      this.isSortUp = true;
    } else {
      this.isSortUp = false;
      this.sortDirections[iconIndex] = 'asc';
    }

    this.customers.sort((a, b) => {
      const valA = a[fieldName].toString().toLowerCase();
      const valB = b[fieldName].toString().toLowerCase();
      if (valA < valB) return this.sortDirections[iconIndex] === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirections[iconIndex] === 'asc' ? 1 : -1;
      return 0;
    });

  }

  // getDisplayName(fieldName: string) {
  //   for (let index = 0; index < this.customerFields.length; index++) {
  //     const field = this.customerFields[index];
  //     if (field.fieldName === fieldName) {
  //       return field.displayName
  //     }
  //   }
  //   return

  // }


  openCustomerProfile(index: number) {
    this.sharedservice.changeComponents('customer')
    const customer = this.customers[index];
    this.sharedservice.customer = customer;
    this.sharedservice.isNewCustomer = false;
    // this.sharedservice.currentUser = this.currentUser;
    this.sharedservice.changeTemplate('details');
    this.dataservice.saveDataToLocalStorage('customer', customer);
    this.sharedservice.sendCustomerData(customer);
  }


}

