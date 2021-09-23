import { Component } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items$: Observable<any[]>;

  constructor(
    firestore: AngularFirestore
  ) {
    // const col = collection(firestore, 'missions');
    // this.item$ = collectionData(col);

    this.items$ = firestore.collection('missions').valueChanges();
  }

}
