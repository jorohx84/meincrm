import { Routes } from '@angular/router';
import { AddcompanyComponent } from './addcompany/addcompany.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: 'company', component: AddcompanyComponent },
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent },
];
