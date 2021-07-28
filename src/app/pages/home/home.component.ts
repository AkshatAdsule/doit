import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "../../types";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public lists?: string[];
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async ngOnInit(): Promise<void> {
    let current_user: firebase.default.User | null = await this.auth
      .currentUser;
    let email = current_user?.email;

    this.firestore
      .doc<User>(`/users/${email}`)
      .valueChanges()
      .subscribe((doc) => {
        this.lists = doc?.lists!;
      });
  }
}
