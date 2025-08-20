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

  customerFields = [  //hier werden die felder der Tabelle hinzugefügt!!!!!
    { fieldName: 'name', displayName: 'Name' },
    { fieldName: 'street', displayName: 'Straße' },
    { fieldName: 'city', displayName: 'Stadt' },
    { fieldName: 'areacode', displayName: 'PLZ' },
    { fieldName: 'phone', displayName: 'Telefon' },
    { fieldName: 'email', displayName: 'E-Mail' },
    { fieldName: 'branch', displayName: 'Branche' },

  ];

  currentSearchFilter: any = this.customerFields[0];
  async ngOnInit() {
    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
      }
    });
    this.dataservice.customerSubject$.subscribe((customers) => {
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
    console.log(index);
    this.currentSearchFilter = this.customerFields[index];
  }

  searchCustomer() {
    if (this.searchValue.length > 0) {
      this.isSearch = true
      const key: keyof Customer = this.currentSearchFilter.keyName as keyof Customer;
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
    this.toggle = !this.toggle;
    this.isSortUp = this.toggle === false ? true : false;
    this.isSortDown = this.toggle === true ? true : false;
    console.log(this.activeSortIndex);
  }

  getDisplayName(fieldName: string) {
    for (let index = 0; index < this.customerFields.length; index++) {
      const field = this.customerFields[index];
      if (field.fieldName === fieldName) {
        return field.displayName
      }
    }
    return
  }
}
