import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../models/user.class';
import { DataService } from '../data.service';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sharedservice = inject(SharedService)
  userservice = inject(UserService);
  dataservice = inject(DataService);
  currentUser: any;

  constructor() {
    this.sharedservice.isLogin = false;
    console.log(this.sharedservice.isLogin);
    // this.currentUser = this.userservice.currentUser;
    console.log(this.currentUser);
    this.loadComponent();
  }


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user){
      this.currentUser = user;
      console.log(this.currentUser);
    
      }

    })

  }

  loadComponent() {
    this.dataservice.getDataFromLocalStorage('component');
    this.sharedservice.component = this.dataservice.data;
    console.log(this.sharedservice.component);
    
  }




}
