import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MailboxComponent } from '../mailbox/mailbox.component';
import { TasksComponent } from '../tasks/tasks.component';
import { CustomerComponent } from '../customer/customer.component';
import { AdminComponent } from '../admin/admin.component';
import { CustomercreationComponent } from '../customercreation/customercreation.component';


@Component({
  selector: 'app-main',
  imports: [CommonModule, HeaderComponent, SidebarComponent, DashboardComponent, MailboxComponent, TasksComponent, CustomerComponent, AdminComponent, CustomercreationComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [UserService, DataService],
})
export class MainComponent {

  userservice = inject(UserService);
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  currentUser: any;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  time: number = 0;
  timer: any;
  currentTime: string = '';
  private userSubscription: Subscription | null = null;

  constructor() {
    // this.loadMainWindow();

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

  }

  loadMainWindow() {
    this.dataservice.getDataFromLocalStorage('fullscreen');
    this.sharedservice.isFullscreen = this.dataservice.data;
    this.dataservice.getDataFromLocalStorage('slide');
    this.sharedservice.isSlide = this.dataservice.data;

  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toISOString();
  }

  toogleFullscreen() {
    this.sharedservice.isFullscreen = !this.sharedservice.isFullscreen;
    this.dataservice.saveDataToLocalStorage('fullscreen', this.sharedservice.isFullscreen);


  }






}
