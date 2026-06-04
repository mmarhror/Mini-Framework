import { createVnode } from "../../framework/dom.js";

export default function Footer(dispatch, todos) {
  const path = window.location.hash.slice(1) || "/";

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  return createVnode(
    "footer",
    { class: "footer", "data-testid": "footer" },
    // Todo count
    createVnode(
      "span",
      { class: "todo-count" },
      `${activeCount} ${activeCount === 1 ? "item left!" : "items left!"}`,
    ),

    // Filters
    createVnode(
      "ul",
      { class: "filters" },
      createVnode(
        "li",
        {},
        createVnode(
          "a",
          { href: "#/", class: path === "/" ? "selected" : "" },
          "All",
        ),
      ),
      createVnode(
        "li",
        {},
        createVnode(
          "a",
          { href: "#/active", class: path === "/active" ? "selected" : "" },
          "Active",
        ),
      ),
      createVnode(
        "li",
        {},
        createVnode(
          "a",
          {
            href: "#/completed",
            class: path === "/completed" ? "selected" : "",
          },
          "Completed",
        ),
      ),
    ),

    // Button
    createVnode(
      "button",
      {
        class: "clear-completed",
        onClick: () => {
          if (!hasCompleted) return;
          dispatch("clearCompletedTodos");
        },
      },
      "Clear completed",
    ),
  );
}
