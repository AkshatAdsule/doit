import { Component, OnInit } from "@angular/core";
import { ToDoListItem } from "../types";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  public isChecked: boolean = true;

  public mockTodoItems: ToDoListItem[] = [
    {
      index: 0,
      title: "Generate mockups",
      done: true,
    },
    {
      index: 1,
      title: "Finish User Interface",
      done: false,
    },
    {
      index: 2,
      title: "Finish Backend",
      done: false,
    },
    {
      index: 3,
      title: "Open Alpha Testing",
      done: false,
    },
    {
      index: 5,
      title: "Finalize release",
      done: false,
    },
  ];

  public completedCount = this.mockTodoItems.filter((item) => item.done).length;

  public incompleteCount = this.mockTodoItems.filter((item) => !item.done)
    .length;

  onCheckBoxClick(id: number) {
    this.mockTodoItems.map((item) => {
      if (item.index == id) {
        item.done = !item.done;
      }
    });
    this.completedCount = this.mockTodoItems.filter((item) => item.done).length;
    this.incompleteCount = this.mockTodoItems.filter(
      (item) => !item.done
    ).length;
  }

  constructor() {}

  ngOnInit(): void {}
}
