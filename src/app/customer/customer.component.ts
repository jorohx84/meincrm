import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { SharedService } from '../shared.service';
import { collection } from 'firebase/firestore';
import { DataService } from '../data.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

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

  async ngOnInit() {
    this.userservice.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
      }
    });
    this.dataservice.customerSubject$.subscribe((customers) => {
      if (customers) {
        this.customers = customers
      }

    })

  }


  isBackground(index: number) {
    return index % 2 === 0;
  }





}
