import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async ngOnInit(): Promise<void> {
    let current_user: firebase.default.User | null = await this.auth
      .currentUser;
    let lists = this.firestore
      .collection<User>('users')
      .doc(current_user?.email ?? '')
      .get();
    lists.subscribe({
      next(list) {
        console.log(list);
      },
    });
  }
}
