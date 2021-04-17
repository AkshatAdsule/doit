import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide_password = true;

  login_form = new FormGroup({
    email: new FormControl('', [Validators.email]),
    password: new FormControl(''),
  });

  constructor(private auth: AngularFireAuth, private router: Router) {}

  onFormSubmit(): void {
    let formValue = this.login_form.value;
    this.auth
      .signInWithEmailAndPassword(formValue.email, formValue.password)
      .then((res) => {
        console.log('Logged In');
        console.log(res.user?.uid);
        this.router.navigate(['home']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit(): void {}
}
