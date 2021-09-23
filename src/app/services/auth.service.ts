import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { filter, first, map } from 'rxjs/operators';
// import { User, UserStatus } from '../models/user';
// import { CacheService } from './cache.service';
// import { PushNotificationService } from './push-notification.service';
// import { ReservationService } from './reservation.service';
// import { UserService } from './user.service';


// import firebase from 'firebase/app';

import firebase from '@firebase/app-compat';
// import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';

import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private loggedInUserSubscription: Subscription;
  // private pushNotificationSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    // private facebook: Facebook,
    private platform: Platform,
    private userService: UserService,
    // private reservationService: ReservationService,
    // private pushNotificationService: PushNotificationService,
    // private cacheService: CacheService<any>,
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {     
        console.log(user);
        // if (this.pushNotificationSubscription) this.pushNotificationSubscription.unsubscribe();
        // this.pushNotificationSubscription = this.pushNotificationService.token$.subscribe((token: string) => {
        //   if (token) {
        //     // only one token by user, change that
        //     this.afs.collection('users-push-tokens').doc(user.uid).set({ token: token });
        //   }
        // })

        this.userService.observeLoggedInUser(user.uid);
        // if (this.loggedInUserSubscription) this.loggedInUserSubscription.unsubscribe();
        // this.loggedInUserSubscription = this.userService.loggedInUser$.pipe(filter((u: User) => !!u), first()).subscribe((u: User) => {
        //   console.log(u);
        //   if (u.status === UserStatus.Admin) {
        //     this.router.navigate(['/admin']);
        //     this.reservationService.unloadReservations();
        //   } else if (u.status === UserStatus.Manager) {
        //     this.router.navigate(['/manager']);
        //     // this.commerceService.loadCommerces();
        //     this.reservationService.unloadReservations();
        //   } else {
        //     this.router.navigate(['/customer']);
        //     this.reservationService.loadReservations();
        //   }
        // });
      } else {
        // if (this.loggedInUserSubscription) this.loggedInUserSubscription.unsubscribe();
        // this.userService.setLoggedInUser(null);
        // this.cacheService.deleteAllCaches();
        // JSON.parse(localStorage.getItem('user'));
        // console.log('logout');
        // this.router.navigate(['/login']);
      }
    });
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.message);
    }
  }

  // Sign up with email/password
  async signUp(user: User, password: string) {
    try {
      this.afAuth.createUserWithEmailAndPassword
      const credentials = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
      this.afs.collection<User>('users').doc(credentials.user.uid).set({ ...user });
      console.log('Sucess', credentials);
    } catch(error) {
      console.log('Something went wrong: ', error);
    }

    // this.signIn(loggedInUser.email, password);
  }

  // // Send email verfificaiton when new user sign up
  // SendVerificationMail() {
  //   return this.afAuth.auth.currentUser.sendEmailVerification()
  //   .then(() => {
  //     this.router.navigate(['verify-email-address']);
  //   })
  // }

  // // Reset Forggot password
  // ForgotPassword(passwordResetEmail) {
  //   return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
  //   .then(() => {
  //     window.alert('Password reset email sent, check your inbox.');
  //   }).catch((error) => {
  //     window.alert(error)
  //   })
  // }

  async facebookLogin() {
    if (this.platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }

  async browserFacebookAuth() {

    // (await this.afAuth.app).auth.Fac

    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday, email, public_profile');


    firebase.auth().signInWithRedirect(provider);
    firebase.auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {

          console.log(result);
          // debugger
          /** @type {firebase.auth.OAuthCredential} */
          const credential: any = result.credential;

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = credential.accessToken;

          // Update or Add user profile
          this.updateUserData(result.user);
        }
        // The signed-in user info.
        const user = result.user;
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  }

  async nativeFacebookAuth(): Promise<void> {
    try {
      const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
      const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

      console.log(result);

      if (result.accessToken) {
        // Login successful.
        console.log(`Facebook access token is ${result.accessToken.token}`);
      }
      
    } catch (err) {
      console.log(err);
    }
  }

  // async nativeFacebookAuth(): Promise<void> {
  //   try {
  //     const response = await this.facebook.login(["public_profile", "email"]);
  //     console.log(response);
  //     if (response.authResponse) {
  //       // User is signed-in Facebook.
  //       const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
  //         unsubscribe();
  //         // Check if we are already signed-in Firebase with the correct user.
  //         if (!this.isUserEqual(response.authResponse, firebaseUser)) {
  //           // Build Firebase credential with the Facebook auth token.
  //           const credential = firebase.auth.FacebookAuthProvider.credential(
  //             response.authResponse.accessToken
  //           );
  //           // Sign in with the credential from the Facebook user.
  //           firebase
  //             .auth()
  //             .signInWithCredential(credential)
  //             .catch(error => {
  //               console.log(error);
  //             });
  //         } else {
  //           // User is already signed-in Firebase with the correct user.
  //           console.log("already signed in");
  //         }
  //       });
  //     } else {
  //       // User is signed-out of Facebook.
  //       firebase.auth().signOut();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  isUserEqual(facebookAuthResponse, firebaseUser): boolean {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      providerData.forEach(data => {
        if (
          data.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          data.uid === facebookAuthResponse.userID
        ) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      });
    }
    return false;
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false) ? true : false;
    return !!user;
  }

  // Sign out
  async signOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    // this.router.navigate(['/']);
  }





  private updateUserData(user) {
    console.log(user);
    const userRef = this.afs.doc(`users/${user.uid}`);
    const data = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    // this.router.navigateByUrl('/home');
    return userRef.set(data, { merge: true });
  }
}
