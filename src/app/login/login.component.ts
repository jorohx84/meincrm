import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.class';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [UserService],
})
export class LoginComponent {
  userservice = inject(UserService);
  sharedService = inject(SharedService);
  user: User = new User();
  auth = inject(Auth);
  router = inject(Router);
  constructor() {

  }

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.user.email, this.user.password);
      console.log(this.userservice.user.uid);
      await this.userservice.setUserLoginTime(this.userservice.user);
      await this.userservice.setOnlineStatus('login', this.userservice.user.uid);
      await this.userservice.findCurrentUser(this.userservice.user.uid);
  
      setTimeout(() => {
        this.router.navigate(['/main'])
      }, 1000);
      console.log('Login war erfolgreich');
    } catch (error) {
      console.log(error);

    }



  }
}
