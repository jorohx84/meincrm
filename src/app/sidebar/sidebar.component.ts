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
  sharedService = inject(SharedService)
  userService = inject(UserService);
  dataService = inject(DataService);
  currentUser: any;

  constructor() {
    this.sharedService.isLogin = false;
    console.log(this.sharedService.isLogin);
    this.currentUser = this.userService.currentUser;
    console.log(this.currentUser);
    this.loadComponent();
  }

  loadComponent() {
    this.dataService.getDataFromLocalStorage('component');
    this.sharedService.component = this.dataService.data;
    console.log(this.sharedService.component);
    
  }

  changeComponents(component: string) {
    this.sharedService.component = component;
    console.log(this.sharedService.component);
    this.dataService.saveDataToLocalStorage('component', component);
  }
}
