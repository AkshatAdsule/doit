interface TodoList {
  owner: string;
  editors?: string[];
  items: ToDoListItem[];
}

interface ToDoListItem {
  id: number;
  title: string;
  done: boolean;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
  uid?: string;
  lists?: string[];
}
