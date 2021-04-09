import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit, AfterViewInit {
  @Input() listItem!: ToDoListItem;
  @Output() itemCheckedEvent = new EventEmitter<number>();
  @ViewChild('checkbox')
  checkbox!: ElementRef;

  constructor() {}

  onCheck() {
    this.itemCheckedEvent.emit(this.listItem.id);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.checkbox.nativeElement.checked = this.listItem.done;
  }
}
