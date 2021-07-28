export interface TodoList {
  title: string;
  owner: string;
  color?: string;
  editors?: string[];
  items: ToDoListItem[];
}

export interface ToDoListItem {
  index: number;
  title: string;
  done: boolean;
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  uid?: string;
  lists?: string[];
}
