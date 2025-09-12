import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-customertasks',
  imports: [CommonModule],
  templateUrl: './customertasks.component.html',
  styleUrl: './customertasks.component.scss'
})
export class CustomertasksComponent {
  dataservice = inject(DataService);
  tasks: any[] = [];

  async ngOnInit() {
    this.dataservice.tasksSubject$.subscribe((tasksList) => {
      if (tasksList) {
        this.tasks = tasksList;
        console.log(this.tasks);
        
      }else{
        console.log('keine tasks gefunden');
        
      }
    });
  }
}
