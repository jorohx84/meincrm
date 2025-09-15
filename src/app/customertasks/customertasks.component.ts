import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-customertasks',
  imports: [CommonModule],
  templateUrl: './customertasks.component.html',
  styleUrl: './customertasks.component.scss'
})
export class CustomertasksComponent {
  dataservice = inject(DataService);
  sharedservice = inject(SharedService);
  tasks: any[] = [];

  tasksfields = [
    { fieldname: 'title', displayName: 'Titel' },
    { fieldname: 'startDate', displayName: 'Erstellt am' },
    { fieldname: 'dueDate', displayName: 'Fällig am' },
    { fieldname: 'createdBy', displayName: 'Ersteller' },
    { fieldname: 'assigned_to', displayName: 'Zusändigkeit' },
    { fieldname: 'priority', displayName: 'Priorität' },
    { fieldname: 'state', displayName: 'Status' },
  ]

  async ngOnInit() {
    this.dataservice.tasksSubject$.subscribe((tasksList) => {
      if (tasksList) {
        this.tasks = tasksList;
        console.log(this.tasks);

      } else {
        console.log('keine tasks gefunden');

      }
    });
  }
}
