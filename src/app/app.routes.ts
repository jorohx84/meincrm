import { Routes } from '@angular/router';
import { AddcompanyComponent } from './addcompany/addcompany.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { TasksComponent } from './tasks/tasks.component';
import { CustomerComponent } from './customer/customer.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    { path: 'main', component: MainComponent },
    { path: 'company', component: AddcompanyComponent },
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'mailbox', component: MailboxComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'customers', component: CustomerComponent },
    { path: 'login', component: LoginComponent },
];
