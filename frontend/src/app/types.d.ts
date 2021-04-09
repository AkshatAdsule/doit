interface TodoList {
  owner: string;
  editors?: User[];
  share_type: ShareType;
  items: ToDoListItem[];
}

interface ToDoListItem {
  title: string;
  done: boolean;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
}

declare enum ShareType {
  private,
  semi_public,
  public,
}
