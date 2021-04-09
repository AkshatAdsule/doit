import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isLoggedIn = new BehaviorSubject(false);

  public loggedInUser: BehaviorSubject<User> = new BehaviorSubject({
    email: 'UNSET',
    first_name: 'UNSET',
    last_name: 'UNSET',
  });

  constructor() {}

  public login(user: User) {
    this.loggedInUser.next(user);
    this.isLoggedIn.next(true);
  }

  public getUser(): BehaviorSubject<User> {
    return this.loggedInUser;
  }
}
