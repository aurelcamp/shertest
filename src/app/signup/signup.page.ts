import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user: User;
  password: string;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.user = new User();
  }

  signup() {
    this.authService.signUp(this.user, this.password);
  }

  signout() {
    this.authService.signOut();
  }

  facebookLogin() {
    this.authService.facebookLogin();
  }

}
