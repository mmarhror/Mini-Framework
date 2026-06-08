import { createVnode } from "../../framework/dom.js";

import TodoElement from "./todo-element.js";

export default function TodoList(dispatch, todos, editingId) {
  const todoItems = todos.map((todo) => {
    const isEditing = editingId === todo.id;

    return createVnode(
      "li",
      {
        key: todo.id,
        "data-testid": "todo-item",
        class: [todo.completed ? "completed" : "", isEditing ? "editing" : ""]
          .join(" ")
          .trim(),
      },
      ...TodoElement(dispatch, todo, isEditing),
    );
  });

  return createVnode(
    "ul",
    { class: "todo-list", "data-testid": "todo-list" },
    ...todoItems,
  );
}
