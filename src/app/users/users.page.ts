import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users$: Observable<User[]>;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.users$ = this.afs.collection<User>('users').valueChanges({idField: 'id'});
  }

  chat(user: User) {
    const loggedInUser = this.userService.getLoggedInUser();
    const chatId = loggedInUser.id < user.id ? `${loggedInUser.id}_${user.id}` : `${user.id}_${loggedInUser.id}`
    this.router.navigate(['chat', chatId]);
  }

}
