import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-customer',
  imports: [],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  userservice = inject(UserService);
  sharedservice = inject(SharedService);
  currentUser: any;


  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        // const companyID = user?.displayName;
        // this.currentUser = await this.userservice.findCurrentUser(user.uid, companyID);
        this.currentUser = user;
        console.log(this.currentUser);
      }
    });

    this.userservice.usersSubject$.subscribe((users) => {
      if (users) {
        console.log(users);
      }

    })
  }


  openCustomerCreation() {
    this.sharedservice.changeComponents('create');
    this.sharedservice.currentUser = this.currentUser;
  }


}
