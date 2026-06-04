import { createVnode } from "../../framework/dom.js";

import ToggleAllContainer from "./toggle-all-container.js";
import TodoList from "./todo-list.js";

function getFilteredTodos(filter, todos) {
  let filtered = todos;

  switch (filter) {
    case "active":
      filtered = todos.filter((todo) => !todo.completed);
      break;

    case "completed":
      filtered = todos.filter((todo) => todo.completed);
      break;
  }

  return filtered;
}

export default function Main(dispatch, { todos, filter, editingId }) {
  const filtered = getFilteredTodos(filter, todos);
  const allCompleted = todos.every((todo) => todo.completed);

  return createVnode(
    "main",
    { class: "main", "data-testid": "main" },
    filtered.length > 0 && ToggleAllContainer(dispatch, allCompleted),
    TodoList(dispatch, filtered, editingId),
  );
}
