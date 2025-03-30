import { CommonModule } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [UserService, DataService],
})
export class DashboardComponent {
  userservice = inject(UserService);
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  currentUser: any;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  private userSubscription: Subscription | null = null;

  constructor() {

  }

  checkRole() {
    if (this.currentUser.role === 'admin') {
      this.isAdmin = true;
    }
    if (this.currentUser.role === 'superadmin') {
      this.isSuperAdmin = true;
      this.isAdmin = true;
    }

    console.log(this.isAdmin);
    console.log(this.isSuperAdmin);


  }

  ngOnInit() {

    this.dataservice.getDataFromLocalStorage('user');
    this.currentUser = this.dataservice.data;
    console.log(this.currentUser);
    this.checkRole();
  }
}
