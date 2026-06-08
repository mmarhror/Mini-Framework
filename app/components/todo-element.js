import { createVnode } from "../../framework/dom.js";

export default function TodoElement(dispatch, todo, isEditing) {
  let submitted = false;

  function handleKeydown(e) {
    if (e.key === "Enter") {
      const trimmed = e.target.value.trim();
      if (!trimmed || trimmed.length <= 1) return;

      submitted = true;
      dispatch("editTodo", { todoId: todo.id, title: trimmed });
      e.target.value = "";
    }
  }

  function handleBlur(e) {
    if (submitted) return;
    dispatch("cancelEditing");
  }

  function handleMount(elem) {
    console.log("handleMount called", elem);

    elem.focus();
  }

  return [
    createVnode(
      "div",
      { class: "view" },
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
          ondblclick: () => dispatch("startEditing", todo.id),
        },
        todo.title,
      ),
      createVnode("button", {
        class: "destroy",
        "data-testid": "todo-item-button",
        onClick: () => dispatch("removeTodo", todo.id),
      }),
    ),
    isEditing
      ? createVnode("input", {
          class: "edit",
          "data-testid": "text-input",
          "aria-label": "Edit todo",
          type: "text",
          value: todo.title,
          // Actions
          onKeydown: handleKeydown,
          onBlur: handleBlur,
          onMount: handleMount,
        })
      : null,
  ];
}
