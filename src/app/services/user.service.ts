import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from '../models/user';
// import * as firebase from 'firebase';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedInUserSource: BehaviorSubject<User> = new BehaviorSubject(null);
  loggedInUser$ = this.loggedInUserSource.asObservable();

  loggedInUserSubscription: Subscription;

  constructor(
    // private afFunctions: AngularFireFunctions,
    private afs: AngularFirestore,
  ) { }

  getLoggedInUser(): User {
    return this.loggedInUserSource.getValue() || JSON.parse(localStorage.getItem('user'));
  }

  setLoggedInUser(user: User) {
    localStorage.setItem('user', user ? JSON.stringify(user) : null);
    this.loggedInUserSource.next(user);
  }

  observeLoggedInUser(userId: string) {
    if (this.loggedInUserSubscription) this.loggedInUserSubscription.unsubscribe();
    this.loggedInUserSubscription = this.afs.doc(`users/${userId}`).valueChanges({idField: 'id'}).subscribe((user: User) => {
      this.setLoggedInUser(user);
    });
  }

  getUserObs(id: string) {
    return this.afs.doc(`users/${id}`).valueChanges();
  }

  async createUser(user: User, password: string) {
    // const fn = this.afFunctions.httpsCallable('createUser');
    // const response = await fn({ user, password }).toPromise();
    // if ('httpErrorCode' in response) {
    //   throw response;
    // }
    // return response;
  }
}
