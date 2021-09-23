import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  newMessage: string;

  chatId: string;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      console.log(this.chatId);

      this.afs.collection('chats').doc(this.chatId).collection('messages').valueChanges().subscribe((data) => console.log(data));
    });
  }

  addNewMessage() {
    this.afs.collection('chats').doc(this.chatId).collection('messages').add(({ text: this.newMessage }));
  }

}
