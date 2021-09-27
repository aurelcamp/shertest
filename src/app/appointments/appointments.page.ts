import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Platform } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {

  users$: Observable<User[]>;
  appointments$: Observable<Appointment[]>;
  loggedInUser: User;
  otherUser: User;

  dateStart: Date;
  dateEnd: Date;

  constructor(
    private calendar: Calendar,
    private afs: AngularFirestore,
    private userService: UserService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.users$ = this.afs.collection<User>('users').valueChanges({idField: 'id'});

    this.loggedInUser = this.userService.getLoggedInUser();

    // this.appointments$ = this.afs.collection<Appointment>('appointments', ref => {
    //   return ref
    //     .where('')
    // })

    const $sent = this.afs.collection<Appointment>('appointments', ref => ref.where('senderId', '==', this.loggedInUser.id)).valueChanges();
    const $received = this.afs.collection<Appointment>('appointments', ref => ref.where('receiverId', '==', this.loggedInUser.id)).valueChanges();

    // this.appointments$ = combineLatest($sent,$received).pipe(
    //     map(([one, two]) => [...one, ...two])
    // )

    this.appointments$ = combineLatest([$sent,$received]).pipe(
      map(([one, two]) => [...one, ...two])
    )

    // return this.afs.collection<any>('commerces', ref => {
    //   return ref
    //       .where('mid', '==', mid);
    // }).valueChanges();
  }

  // validate() {
  //   console.log(this.dayDate);

  //   this.calendar.createCalendar('MyCalendar').then(
  //     (msg) => { console.log(msg); },
  //     (err) => { console.log(err); }
  //   );

  //   this.calendar.createEvent('Essai',)
  // }

  async addEvent() {
    const appointment: Appointment = {
      dateStart: new Date(this.dateStart),
      dateEnd: new Date(this.dateEnd),
      title: 'Essai1',
      senderId: this.loggedInUser.id,
      receiverId: this.otherUser.id
    }
    if (this.platform.is('hybrid')) {
      try {
        console.log('pass');
        const options = this.calendar.getCalendarOptions();
        options.firstReminderMinutes = null;
        options.secondReminderMinutes = 5;
        const rep = await this.calendar.createEventWithOptions('Essai', 'Paris', 'note1', new Date(this.dateStart), new Date(this.dateEnd), options);
        console.log(rep);
      } catch(e) {
        console.log(e);
      }
    }

    this.afs.collection<Appointment>('appointments').add(appointment);
    // return this.calendar.createEventInteractively("event title");
  }

  validate() {
    if (this.platform.is('hybrid')) {
      this.calendar.hasReadWritePermission().then((result) => {
        if(result === false) {
          this.calendar.requestReadWritePermission().then((v) => {
            this.addEvent();
          },(r) => {
            console.log("Rejected");
          })
        }
        else {
          this.addEvent();
        }
      })
    } else {
      this.addEvent();
    }
  }

}
