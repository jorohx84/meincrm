import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-customercreation',
  imports: [CommonModule, FormsModule],
  templateUrl: './customercreation.component.html',
  styleUrl: './customercreation.component.scss'
})
export class CustomercreationComponent {
  sharedservice = inject(SharedService);
  userservice = inject(UserService)
  customer: any;
  currentUser: any;

  async ngOnInit() {
    this.userservice.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = user;
      }

    })

  }

  getCostumerObject() {
    return {
      name: '',
      street: '',
      city: '',
      areacode: '',
      phone: '',
      email: '',
      status: '',
      branch: '',
    }
  }
}
