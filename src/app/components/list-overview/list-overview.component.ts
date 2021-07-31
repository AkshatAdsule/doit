import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ColorService } from "src/app/services/color.service";
import { TodoList } from "../../types";

@Component({
  selector: "app-list-overview",
  templateUrl: "./list-overview.component.html",
  styleUrls: ["./list-overview.component.scss"],
})
export class ListOverviewComponent implements OnInit {
  @Input("document")
  public id?: string;
  public list?: TodoList;

  public doneCount?: number;
  public notDoneCount?: number;

  public isInLightMode: boolean = true;

  constructor(
    private firestore: AngularFirestore,
    public color: ColorService
  ) {}

  // getTextColor(backgroundHex: string): string {
  //   if (backgroundHex == null) {
  //     return "white";
  //   }
  //   var r = parseInt(backgroundHex.substr(1, 2), 16);
  //   var g = parseInt(backgroundHex.substr(3, 2), 16);
  //   var b = parseInt(backgroundHex.substr(5, 2), 16);
  //   var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  //   this.isInLightMode = yiq < 128;
  //   return yiq >= 128 ? "black" : "white";
  // }

  ngOnInit(): void {
    this.firestore
      .doc<TodoList>(`lists/${this.id}`)
      .valueChanges()
      .subscribe((val) => {
        this.isInLightMode = this.color.getTextColor(val?.color!) === "black";
        this.list = val!;
        this.doneCount = val?.items.filter((item) => item.done).length;
        this.notDoneCount = val?.items.length! - this.doneCount!;
      });
  }
}
