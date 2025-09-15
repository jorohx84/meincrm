import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser: any;
  userservice = inject(UserService);
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  timer: any;
  currentTime: string = '';
  customer: any;

  constructor() {
    this.currentUser = this.userservice.currentUser;
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1);
  }

  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
      }

    })

    this.sharedservice.customerSubject$.subscribe((data) => {
      if (data) {
        this.customer = data;
      } else {
        this.dataservice.getDataFromLocalStorage('customer');
        this.customer = this.dataservice.data;
      }
    })

  }

  checkLocation() {
    return window.location.pathname.includes('main');
  }
  updateTime() {
    const now = new Date();
    this.currentTime = now.toISOString();
  }

  logoutUser() {
    this.userservice.logoutUser(this.currentUser);
  }

  toggleSlide(event: Event) {
    this.sharedservice.isSlide = !this.sharedservice.isSlide;
    this.sharedservice.isFullscreen = false;
    this.dataservice.saveDataToLocalStorage('fullscreen', this.sharedservice.isFullscreen);
    this.dataservice.saveDataToLocalStorage('slide', this.sharedservice.isSlide);
    event.stopPropagation();
  }


}
