import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { ColorService } from "src/app/services/color.service";
import { TodoList, ToDoListItem } from "src/app/types";

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

  private listDoc?: AngularFirestoreDocument<TodoList>;
  private maxIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    public color: ColorService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")!;
    this.auth.user.subscribe((u) => {
      this.verify(u?.uid!);
    });
    this.listDoc = this.firestore.doc<TodoList>(`lists/${this.id}`);
  }

  private verify(uid: string) {
    this.listDoc!.valueChanges().subscribe((list) => {
      list?.items.forEach((i) => {
        this.maxIndex = i.index > this.maxIndex ? i.index : this.maxIndex;
      });
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
}
