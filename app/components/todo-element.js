import { createVnode } from "../../framework/dom.js";

export default function TodoElement(dispatch, todo, isEditing) {
  let submitted = false;

  return createVnode(
    "div",
    { class: "view" },
    ...(isEditing
      ? [
          createVnode(
            "div",
            { class: "input-container" },
            createVnode("input", {
              class: "new-todo",
              id: `todo-input-${todo.id}`,
              type: "text",
              "data-testid": "text-input",
              value: todo.title,
              onKeydown: (e) => {
                if (e.key === "Enter") {
                  const trimmed = e.target.value.trim();
                  if (!trimmed || trimmed.length <= 1) return;

                  submitted = true;
                  dispatch("editTodo", { todoId: todo.id, title: trimmed });
                  e.target.value = "";
                }
              },
              onBlur: () => {
                if (submitted) return;
                dispatch("cancelEditing");
              },
            }),
            createVnode(
              "label",
              { class: "visually-hidden", for: "todo-input" },
              "Edit Todo Input",
            ),
          ),
        ]
      : [
          createVnode("input", {
            class: "toggle",
            type: "checkbox",
            "data-testid": "todo-item-toggle",
            checked: todo.completed,
            onClick: () => dispatch("toggleTodo", todo.id),
          }),
          createVnode(
            "label",
            {
              "data-testid": "todo-item-label",
              ondblclick: () => {
                dispatch("startEditing", todo.id);
                setTimeout(() => {
                  const input = document.getElementById(
                    `todo-input-${todo.id}`,
                  );
                  input.focus();
                }, 0);
              },
            },
            todo.title,
          ),
          createVnode("button", {
            class: "destroy",
            "data-testid": "todo-item-button",
            onClick: () => dispatch("removeTodo", todo.id),
          }),
        ]),
  );
}
