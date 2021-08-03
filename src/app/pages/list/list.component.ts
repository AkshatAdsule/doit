import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { ColorService } from "src/app/services/color.service";
import { TodoList, ToDoListItem, User } from "src/app/types";

import { MatDialog } from "@angular/material/dialog";
import {
  ShareDialogComponent,
  ShareDialogData,
} from "../../components/share-dialog/share-dialog.component";
import { FirebaseUtilService } from "src/app/services/firebase-util.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  public id?: string;
  public list?: TodoList;
  public isVerified = false;

  public doneCount: number = 0;
  public notDoneCount: number = 0;
  public bgColor: string = "#FFFFFF";
  public colorPickerColor: string = "white";
  public showColorPicker: boolean = false;

  private listDoc?: AngularFirestoreDocument<TodoList>;
  private maxIndex: number = 0;
  private uid?: string;
  private lists?: string[];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog,
    private firestoreUtil: FirebaseUtilService,
    public color: ColorService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")!;
    this.auth.user.subscribe((u) => {
      this.verify(u?.uid!);
      this.uid = u?.uid!;

      this.firestoreUtil.getOnce<User>(`/users/${this.uid!}`).then((data) => {
        this.lists = data?.lists!;
      });
    });

    this.listDoc = this.firestore.doc<TodoList>(`lists/${this.id}`);
  }

  private verify(uid: string) {
    this.listDoc!.valueChanges().subscribe((list) => {
      list?.items.forEach((i) => {
        this.maxIndex = i.index > this.maxIndex ? i.index : this.maxIndex;
      });
      this.bgColor = list?.color!;
      if (
        this.isVerified ||
        (list?.editors?.indexOf(uid) !== -1 && list?.owner)
      ) {
        this.isVerified = true;
        this.list = list;
        this.doneCount = list?.items.filter((item) => item.done).length!;
        this.notDoneCount = list?.items.length! - this.doneCount!;
      } else {
        this.router.navigate(["/home"]);
      }
    });
  }
  public async onCheck(idx: number): Promise<void> {
    let newItems = this.list?.items.map<ToDoListItem>((item) =>
      item.index === idx ? { ...item, done: !item.done } : item
    );
    await this.listDoc!.update({ items: newItems });
  }

  public onTitleEdit(event: any): void {
    let newTitle = event.target.value;
    if (newTitle !== this.list?.title) {
      this.listDoc?.update({ title: event.target.value });
    }
  }

  public onItemEdit(index: number, event: any) {
    event.preventDefault();
    let newText = event.target.value;
    let newItems = this.list?.items.map((item) => {
      if (item.index == index) {
        return { ...item, title: newText };
      } else {
        return item;
      }
    });
    this.listDoc?.update({ items: newItems });
  }

  public addItem(event: any) {
    let newItems = this.list?.items;
    newItems?.push({
      title: event.target.value as string,
      done: false,
      index: this.maxIndex + 1,
    });
    event.target.value = "";
    this.listDoc?.update({ items: newItems });
  }

  public delete(index: number) {
    let newItems = this.list?.items.filter((item) => item.index !== index);
    this.listDoc?.update({ items: newItems });
  }

  public async deleteList(): Promise<void> {
    if (confirm("Are you sure you want to delete this list?")) {
      // remove list from user's lists
      this.firestore
        .doc<User>(`/users/${this.uid!}`)
        .update({ lists: this.lists!.filter((list) => list !== this.id) });
      // check if this user is current owner or if they are the only editor,
      if (this.list?.owner == this.uid) {
        //  No one else can see the list... so delete it
        for (let editor of this.list!.editors!) {
          let edtitorData = await this.firestoreUtil.getOnce<User>(
            `users/${editor}`
          );
          this.firestore.doc<User>(`users/${editor}`).update({
            lists: edtitorData?.lists!.filter((list) => list !== this.id),
          });
        }
        await this.listDoc?.delete();
      } else {
        // remove this user from the editors and remove this list from user doc
        {
          this.lists = this.lists?.filter((list) => list !== this.id);
          this.firestore.doc<User>(`users/${this.uid}`).update({
            lists: this.lists,
          });
        }
        this.listDoc?.update({
          editors: this.list!.editors!.filter((u) => u !== this.uid),
        });
      }
      this.router.navigate(["home"]);
    }
  }

  public toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  public onColorChange(newColor: string) {
    this.listDoc?.update({ color: newColor });
  }

  public changeColorPickerTextColor(color: string) {
    this.colorPickerColor = this.color.getTextColor(color);
  }

  openShareDialog() {
    console.log(this.list?.editors!);
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      disableClose: true,
      data: {
        uid: this.uid!,
        listId: this.id!,
        editors: this.list!.editors!,
      },
    });

    dialogRef.afterClosed().subscribe(async (result: ShareDialogData) => {
      console.log(result);
      this.listDoc?.update({ editors: result.editors });
    });
  }
}
