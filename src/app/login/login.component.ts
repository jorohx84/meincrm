import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.class';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

import { SharedService } from '../shared.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [UserService],
})
export class LoginComponent {
  authservice = inject(AuthService);
  user: User = new User();
  router = inject(Router);



async login(){
  await this.authservice.login(this.user.email, this.user.password);
}

async guestLogin(){
    await this.authservice.login('johannes-roth@hotmail.com', 'Muster123456');
}

}
