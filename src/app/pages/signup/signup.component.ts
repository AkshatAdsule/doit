import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../types";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  hide_password = true;
  signup_form = new FormGroup({
    first_name: new FormControl("", [Validators.required]),
    last_name: new FormControl("", [Validators.required]),
    user_name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  onSignUp() {
    if (this.signup_form.valid) {
      this.auth
        .createUserWithEmailAndPassword(
          this.signup_form.get("email")?.value,
          this.signup_form.get("password")?.value
        )
        .then((res) => {
          // User was created successfully, add them to firestore
          let formValue = this.signup_form.value;
          this.firestore.collection<User>("/users").doc(formValue.email).set({
            first_name: formValue.first_name,
            last_name: formValue.last_name,
            email: formValue.email,
            uid: res.user?.uid,
            lists: [],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ngOnInit(): void {}
}
