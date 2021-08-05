import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide_password = true;

  login_form = new FormGroup({
    email: new FormControl("", [Validators.email]),
    password: new FormControl(""),
  });

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  onFormSubmit(): void {
    let formValue = this.login_form.value;
    this.auth
      .signInWithEmailAndPassword(formValue.email, formValue.password)
      .then((res) => {
        this.router.navigate(["home"]);
      })
      .catch((err) => {
        let message = "";
        switch (err.code) {
          case "auth/user-not-found":
            message =
              "Could not find a user associated with that email. Have you signed up?";
            break;
          case "auth/wrong-password":
            message = "Invalid email/password combination";
            break;
          default:
            message = "Error while signing in. Try again later";
        }
        this.snackbar.open(message, "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center",
          duration: 3000,
        });
      });
  }

  ngOnInit(): void {}
}
