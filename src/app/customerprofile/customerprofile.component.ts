import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-customerprofile',
  imports: [CommonModule],
  templateUrl: './customerprofile.component.html',
  styleUrl: './customerprofile.component.scss'
})
export class CustomerprofileComponent {
  sharedservice = inject(SharedService);
  dataservice = inject(DataService);
  customer: any;
  ngOnInit() {
    if (this.sharedservice.customer) {
      this.customer = this.sharedservice.customer;
    } else {
      this.dataservice.getDataFromLocalStorage('customer');
      this.customer = this.dataservice.data;
    }

  }
}
