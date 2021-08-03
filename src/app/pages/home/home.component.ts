import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { TodoList, User } from "../../types";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public lists?: string[];
  private email: string = "";
  private uid: string = "";
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let current_user: firebase.default.User | null = await this.auth
      .currentUser;
    this.uid = current_user?.uid!;
    this.email = current_user?.email!;

    this.firestore
      .doc<User>(`/users/${this.uid}`)
      .valueChanges()
      .subscribe((doc) => {
        this.lists = doc?.lists!;
      });
  }

  public new() {
    this.firestore
      .collection<TodoList>("/lists")
      .add({
        owner: this.uid,
        title: "New List",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        editors: [this.uid],
        items: [],
      })
      .then(async (doc) => {
        await this.firestore
          .doc<User>(`/users/${this.uid}`)
          .update({ lists: [...this.lists!, doc.id] });
        this.router.navigateByUrl(`/list/${doc.id}`);
      });
  }
}
