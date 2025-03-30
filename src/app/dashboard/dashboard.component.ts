import { CommonModule } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [UserService],
})
export class DashboardComponent {
userservice=inject(UserService);
currentUser:any;
private userSubscription: Subscription | null = null;

constructor(){
  console.log(this.userservice.user.uid);
  
}

ngOnInit(){}
}
