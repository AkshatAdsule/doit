import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent implements OnInit {
  isLoggedIn!: boolean;
  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      console.log(!!user?.uid);
      this.isLoggedIn = !!user?.uid;
    });
  }

  logout(): void {
    this.auth.signOut();
  }
}
