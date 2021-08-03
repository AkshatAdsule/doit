import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FirebaseUtilService {
  constructor(private firestore: AngularFirestore) {}

  public async getOnce<T>(route: string): Promise<T | undefined> {
    return await this.firestore
      .doc<T>(route)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }
}
