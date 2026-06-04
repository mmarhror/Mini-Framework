import { createVnode } from "../../framework/dom.js";

export default function TodoElement(dispatch, todo, isEditing) {
  let submitted = false;

  return createVnode(
    "div",
    { class: "view" },
    ...(isEditing
      ? []
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
              ondblclick: () => dispatch("startEditing", todo.id),
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

// InputContainer({
//             id: `edit-todo-${todo.id}`,
//             value: todo.title,
//             dataTestId: "text-input",
//             onKeydown: (e) => {
//               if (e.key === "Enter") {
//                 const newTitle = e.target.value.trim();

//                 if (!newTitle || newTitle.length <= 1) return;

//                 submitted = true;
//                 dispatch("editTodo", {
//                   todoId: todo.id,
//                   title: newTitle,
//                 });
//               }
//             },
//             onBlur: () => {
//               if (submitted) return;
//               dispatch("cancelEditing");
//             },
//             labelText: "Edit Todo Input",
//           }),
