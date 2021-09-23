import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Property } from '../models/property';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {

  properties$: Observable<Property[]>;

  constructor(
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.properties$ = this.afs.collection<Property>('properties').valueChanges();
  }

}
