import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-userslist',
  imports: [CommonModule],
  templateUrl: './userslist.component.html',
  styleUrl: './userslist.component.scss'
})
export class UserslistComponent {
  sharedservice = inject(SharedService);
  userservice = inject(UserService);
  dataservice = inject(DataService);
  users: any[] = [];

  async ngOnInit() {

    this.userservice.usersSubject$.subscribe((dataList) => {
      if (dataList) {
        this.users = dataList;
        console.log(this.users);

      }
    })
  }


  setUser(index: number) {
    console.log(index);
    const user = this.users[index];
    this.sharedservice.sendUserFromList(user);
  }
}
