import { CommonModule } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, SidebarComponent],
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

  constructor() {}



  ngOnInit() {
    this.currentUser = this.userservice.currentUser;
    console.log(this.currentUser);
  }




}
