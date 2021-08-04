import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FirebaseUtilService } from "src/app/services/firebase-util.service";
import { User } from "src/app/types";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface ShareDialogData {
  listId: string;
  uid: string;
  editors: string[];
}

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.scss"],
})
export class ShareDialogComponent implements OnInit {
  public changedData!: ShareDialogData;
  public listEditors: User[] = [];
  public addUserControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ShareDialogData,
    private firestore: AngularFirestore,
    private firestoreUtil: FirebaseUtilService,
    private snackBar: MatSnackBar
  ) {
    this.changedData = data;
  }

  async ngOnInit(): Promise<void> {
    for (let user of this.changedData.editors) {
      let userData = await this.firestoreUtil.getOnce<User>(`/users/${user}`);
      if (userData?.uid! !== this.changedData.uid) {
        this.listEditors.push(userData!);
      }
    }
  }

  async addEditor() {
    if (this.addUserControl.valid) {
      let email = this.addUserControl.value;
      let userSnapshot = await this.firestore
        .collection<User>("users", (user) => user.where("email", "==", email))
        .get()
        .toPromise();
      if (userSnapshot.size == 0) {
        this.showError("User does not exist!");
        return;
      }
      let userData = userSnapshot.docs[0].data();
      if (this.changedData.editors.indexOf(userData.uid!) === -1) {
        this.firestore
          .doc<User>(`/users/${userData.uid!}`)
          .update({ lists: [...userData.lists!, this.changedData.listId] });
        this.changedData.editors.push(userData.uid!);
        this.listEditors.push(userData);
      } else {
        this.showError("This person is already a editor!");
        return;
      }
    } else {
      this.showError("Invalid email!");
      return;
    }
  }

  public async removeEditor(uid: string) {
    this.changedData.editors = this.changedData.editors.filter(
      (user) => user !== uid
    );
    this.listEditors = this.listEditors.filter((user) => user.uid !== uid);
    let userData = await this.firestoreUtil.getOnce<User>(`/users/${uid}`);
    this.firestore.doc<User>(`/users/${uid}`).update({
      lists: userData!.lists!.filter(
        (list) => list !== this.changedData.listId
      ),
    });
  }

  private showError(error: string) {
    this.snackBar.open(error, "Dismiss", {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
