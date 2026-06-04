import { createVnode } from "../../framework/dom.js";

export default function Header(dispatch) {
  return createVnode(
    "header",
    { class: "header", "data-testid": "header" },
    createVnode("h1", {}, "todos"),
    createVnode(
      "div",
      { class: "input-container" },
      createVnode("input", {
        class: "new-todo",
        id: "todo-input",
        type: "text",
        placeholder: "What needs to be done?",
        onKeydown: (e) => {
          if (e.key === "Enter") {
            dispatch("addTodo", e.target.value);
            e.target.value = "";
          }
        },
        autofocus: true,
      }),
      createVnode(
        "label",
        { class: "visually-hidden", for: "todo-input" },
        "New Todo Input",
      ),
    ),
  );
}
