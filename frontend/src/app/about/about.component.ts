import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public isChecked: boolean = true;

  public mockTodoItems: ToDoListItem[] = [
    {
      id: 0,
      title: 'Generate mockups',
      done: true,
    },
    {
      id: 1,
      title: 'Finish User Interface',
      done: false,
    },
    {
      id: 2,
      title: 'Finish Backend',
      done: false,
    },
    {
      id: 3,
      title: 'Open Alpha Testing',
      done: false,
    },
    {
      id: 5,
      title: 'Finalize release',
      done: false,
    },
  ];

  public completedCount = this.mockTodoItems.filter((item) => item.done).length;

  public incompleteCount = this.mockTodoItems.filter((item) => !item.done)
    .length;

  onCheckBoxClick(id: number) {
    this.mockTodoItems.map((item) => {
      if (item.id == id) {
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
